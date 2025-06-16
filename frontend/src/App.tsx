import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:8000/items");
    setItems(await res.json());
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditName(item.name);
    setEditDescription(item.description);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = async () => {
    if (!editName.trim() || !editDescription.trim()) return;
    await fetch(`http://localhost:8000/items/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, description: editDescription }),
    });
    setEditId(null);
    setEditName("");
    setEditDescription("");
    fetchItems();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  const handleDownloadCsv = () => {
    window.open("http://localhost:8000/items/csv", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-indigo-900 text-white px-6">
      <div className="w-full max-w-3xl bg-gray-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-indigo-700">
        <h1 className="text-4xl font-extrabold flex items-center gap-3 mb-8 tracking-wide text-indigo-400 drop-shadow-lg">
          📋 Item Manager
        </h1>

        <div className="overflow-x-auto max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-700 rounded-lg border border-indigo-600">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="cursor-pointer hover:bg-indigo-700 hover:bg-opacity-50 transition"
                  onClick={() => startEdit(item)}
                >
                  {editId === item.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleKeyDown}
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          className="w-full px-3 py-2 rounded bg-white text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={handleKeyDown}
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-gray-200 font-semibold truncate max-w-xs">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm truncate max-w-md">
                        {item.description}
                      </td>
                    </>
                  )}
                </tr>

              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-center text-gray-400 italic"
                  >
                    No items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-10 text-right">
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-200 transition font-medium"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
