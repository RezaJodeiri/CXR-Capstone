"""
Author: Nathan Luong, Ayman Akhras, Kelly Deng
"""

import os
import sys
import pytest
from unittest.mock import MagicMock
from .mocks.mock_identity_provider import MockIdentityProvider
from .mocks.mock_report_generation import MockReportGenerationService
from.mocks.mock_prediction_service import MockPredictionService

# Mock runtime module before any imports
mock_runtime = MagicMock()
mock_identity_provider = MockIdentityProvider(
    user_pool_id="xxx",
    client_id="xxx",
    client_secret="xxx"
)
mock_prediction_service = MockPredictionService()
mock_report_generation_service = MockReportGenerationService(mock_identity_provider, mock_prediction_service)


mock_runtime.IdentityProvider = mock_identity_provider
mock_runtime.PredictionService = mock_prediction_service
mock_runtime.ReportGenerationService = mock_report_generation_service
sys.modules['runtime'] = mock_runtime


@pytest.fixture(scope='session', autouse=True)
def add_src_to_path():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '.'))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

@pytest.fixture
def identity_provider():
    mock_runtime.IdentityProvider.reset_mock()
    return mock_runtime.IdentityProvider
