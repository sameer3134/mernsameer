const express = require("express");
const { getNotes, createNote, getNoteById, UpdateNote, DeleteNote } = require("../contollers/noteControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router()

router.route('/').get(protect, getNotes)
router.route('/create').post(protect, createNote)
router.route('/:id').get(getNoteById).put(protect , UpdateNote)
router.route('/:id').put(protect , UpdateNote)
router.route('/:id').delete(protect , DeleteNote);

module.exports= router;