import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_and_list_items():
    response = client.post("/items", json={"name": "ItemTest", "description": "TestDesc"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "ItemTest"

    response = client.get("/items")
    assert response.status_code == 200
    assert any(item["name"] == "ItemTest" for item in response.json())

def test_export_csv():
    response = client.get("/items/csv")
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv"
    assert "id,name,description" in response.text