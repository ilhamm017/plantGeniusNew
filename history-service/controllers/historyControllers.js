const { History } = require('../models');

module.exports = {
// Membuat hostroy baru
createHistory : async (req, res) => {
  try {
    
    const newHistory = await History.create(req.body);
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ error: 'Gagal dalam membuat history' });
  }
},

// Mendapatkan semua history 
getAllHistory : async (req, res) => {
  try {
    const historyEntries = await History.findAll();
    res.status(200).json(historyEntries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get history entries' });
  }
},

// Mendapatkan hostroy berdasarkan ID
getHistoryById : async (req, res) => {
  try {
    const historyEntry = await History.findByPk(req.params.id);
    if (!historyEntry) {
      return res.status(404).json({ error: 'History entry not found' });
    }
    res.status(200).json(historyEntry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get history entry' });
  }
},

// hapus history berdasarkan ID
deleteHistory : async (req, res) => {
  try {
    const historyEntry = await History.findByPk(req.params.id);
    if (!historyEntry) {
      return res.status(404).json({ error: 'History entry not found' });
    }
    await historyEntry.destroy();
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete history entry' });
  }
}

}