"""
Author: Patrick Zhou, Reza Jodeiri
"""

import torch.nn as nn

class TransformerNetwork(nn.Module):
    def __init__(self, in_dim=256, out_dim=9, hidden_dim=1024, d_model=512, n_heads=8, n_layers=2, dropout=0.1):
        super(TransformerNetwork, self).__init__()
        self.embedding = nn.Linear(in_dim, d_model)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=n_heads,
            dim_feedforward=hidden_dim,
            dropout=dropout,
            batch_first=True
        )

        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=n_layers)
        self.output_layer = nn.Linear(d_model, out_dim)

    def forward(self, x):
        x = x.unsqueeze(1)
        x = self.embedding(x)
        x = self.transformer_encoder(x)
        x = x[:, -1]
        x = self.output_layer(x)
        return x