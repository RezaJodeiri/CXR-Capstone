"""
Author: Patrick Zhou, Reza Jodeiri
"""

import torch
import numpy as np
import pytorch_lightning as pl

from torch import nn
from transformers import DetrImageProcessor, DetrForObjectDetection

# Backend - Please ignore warning message
torch._dynamo.config.suppress_errors = True

# Constants
MODEL_CHECKPOINT = 'facebook/detr-resnet-50'
image_processor = DetrImageProcessor.from_pretrained(MODEL_CHECKPOINT)

# Model
class Detr(pl.LightningModule):
    def __init__(self, lr, lr_backbone, weight_decay):
        super().__init__()
        self.model = DetrForObjectDetection.from_pretrained(
            pretrained_model_name_or_path=MODEL_CHECKPOINT,
            num_labels=13,
            ignore_mismatched_sizes=True,
        )

        self.lr = lr
        self.lr_backbone = lr_backbone
        self.weight_decay = weight_decay
        self.save_hyperparameters()

    def forward(self, pixel_values, pixel_mask):
        return self.model(pixel_values=pixel_values, pixel_mask=pixel_mask)

    def common_step(self, batch):
        pixel_values = batch["pixel_values"]
        pixel_mask = batch["pixel_mask"]
        labels = [{k: v.to(self.device) for k, v in t.items()} for t in batch["labels"]]

        outputs = self.model(pixel_values=pixel_values, pixel_mask=pixel_mask, labels=labels)

        loss = outputs.loss
        loss_dict = outputs.loss_dict

        return loss, loss_dict, outputs.logits

    def _center_to_corners_format_torch(self, bboxes_center: "torch.Tensor") -> "torch.Tensor":
        center_x, center_y, width, height = bboxes_center.unbind(-1)
        bbox_corners = torch.stack(
            # top left x, top left y, bottom right x, bottom right y
            [(center_x - 0.5 * width), (center_y - 0.5 * height), (center_x + 0.5 * width), (center_y + 0.5 * height)],
            dim=-1,
        )
        return bbox_corners

    def post_process_object_detection(self, outputs, last_hidden_state = [], threshold: float = 0.5, target_sizes = None, scale = True):
        """
        Converts the raw output of [`DetrForObjectDetection`] into final bounding boxes in (top_left_x, top_left_y,
        bottom_right_x, bottom_right_y) format. Only supports PyTorch.

        Args:
            outputs ([`DetrObjectDetectionOutput`]):
                Raw outputs of the model.
            threshold (`float`, *optional*):
                Score threshold to keep object detection predictions.
            target_sizes (`torch.Tensor` or `List[Tuple[int, int]]`, *optional*):
                Tensor of shape `(batch_size, 2)` or list of tuples (`Tuple[int, int]`) containing the target size
                `(height, width)` of each image in the batch. If unset, predictions will not be resized.
        Returns:
            `List[Dict]`: A list of dictionaries, each dictionary containing the scores, labels and boxes for an image
            in the batch as predicted by the model.
        """
        out_logits, out_bbox = outputs.logits, outputs.pred_boxes

        if target_sizes is not None:
            if len(out_logits) != len(target_sizes):
                raise ValueError(
                    "Make sure that you pass in as many target sizes as the batch dimension of the logits"
                )

        prob = nn.functional.softmax(out_logits, -1)
        scores, labels = prob[..., :-1].max(-1)

        # Convert to [x0, y0, x1, y1] format
        boxes = self._center_to_corners_format_torch(out_bbox)

        # Convert from relative [0, 1] to absolute [0, height] coordinates
        if target_sizes is not None:
            if isinstance(target_sizes, list):
                img_h = torch.Tensor([i[0] for i in target_sizes])
                img_w = torch.Tensor([i[1] for i in target_sizes])
            else:
                img_h, img_w = target_sizes.unbind(1)

            scale_fct = torch.stack([img_w, img_h, img_w, img_h], dim=1).to(boxes.device)
            
            if scale:
                boxes = boxes * scale_fct[:, None, :]

        results = []

        if last_hidden_state:
            for s, l, b, ls in zip(scores, labels, boxes, last_hidden_state):
                score = s[s > threshold]
                label = l[s > threshold]
                state = ls[s > threshold]
                box = b[s > threshold]
                results.append({"scores": score, "labels": label, "boxes": box, "last_hidden_states": state})
        else:
            for s, l, b in zip(scores, labels, boxes):
                score = s[s > threshold]
                label = l[s > threshold]
                box = b[s > threshold]
                results.append({"scores": score, "labels": label, "boxes": box})

        return results

    def unique_segementation(self, dic):
        lines = []

        labels = dic['labels'].cpu().numpy()
        scores = dic['scores'].cpu().numpy()

        unique, counts = np.unique(labels, return_counts=True)
        doc = dict(zip(unique, counts))

        for label_num in range(12, 0, -1):
            if label_num not in doc.keys():
                continue
            elif doc[label_num] != 1:
                idx = np.where(labels == label_num)[0]
                _scores = scores[idx]
                _argmax = np.argmax(_scores)
                max_score_index = idx[_argmax]
                _str = f"{dic['labels'][max_score_index]} {dic['scores'][max_score_index]} {dic['boxes'][max_score_index][0]} {dic['boxes'][max_score_index][1]} {dic['boxes'][max_score_index][2]} {dic['boxes'][max_score_index][3]}"
                lines.append(_str)
            else:
                idx = np.where(labels == label_num)[0][0]
                _str = f"{dic['labels'][idx]} {dic['scores'][idx]} {dic['boxes'][idx][0]} {dic['boxes'][idx][1]} {dic['boxes'][idx][2]} {dic['boxes'][idx][3]}"
                lines.append(_str)
        return lines


    def get_boxes(self, image, scale=True):
        encoding = image_processor(image, return_tensors="pt")
        pixel_values = encoding["pixel_values"].to(self.device)
        pixel_mask = encoding["pixel_mask"].to(self.device)

        with torch.no_grad():
            outputs = self.model(pixel_values=pixel_values, pixel_mask=pixel_mask)

        return self.unique_segementation(
            self.post_process_object_detection(outputs, target_sizes=[(image.height, image.width)], scale=scale)[0]
        )

    def get_features(self, image):
        encoding = image_processor(image, return_tensors="pt")
        pixel_values = encoding["pixel_values"].to(self.device)
        pixel_mask = encoding["pixel_mask"].to(self.device)

        with torch.no_grad():
            outputs = self.model(pixel_values=pixel_values, pixel_mask=pixel_mask)

        out_logits, out_bbox = outputs.logits, outputs.pred_boxes
        prob = nn.functional.softmax(out_logits, -1)
        scores, labels = prob[..., :-1].max(-1)
        scores, labels = scores.squeeze(0).cpu().numpy(), labels.squeeze(0).cpu().numpy()
        last_hidden_states = outputs["last_hidden_state"].squeeze(0)

        final_last_hidden_states = torch.zeros((12, 256), dtype=torch.float32)

        for i in range(1,13):
            positions = np.where(labels == i)[0]
            if len(positions) == 0:
                final_last_hidden_states[i] = 0
            else:
                _scores = scores[positions]
                _argmax = np.argmax(_scores)
                max_score_index = positions[_argmax]
                final_last_hidden_states[i-1] = last_hidden_states[max_score_index]

        return final_last_hidden_states