import os
import sys
import pytest
from unittest.mock import MagicMock

# Mock runtime module before any imports
mock_identity_provider = MagicMock()
mock_runtime = MagicMock()
mock_runtime.IdentityProvider = mock_identity_provider
sys.modules['runtime'] = mock_runtime

@pytest.fixture(scope='session', autouse=True)
def add_src_to_path():
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    if project_root not in sys.path:
        sys.path.insert(0, project_root)

@pytest.fixture
def identity_provider():
    mock_runtime.IdentityProvider.reset_mock()
    return mock_runtime.IdentityProvider
