const Note = require("../models/noteModel")
const asynchandler = require("express-async-handler");

const getNotes = asynchandler(async (req, res) => {
    const notes = await Note.find({user:req.user._id});
    res.json(notes);
});

const createNote = asynchandler(async (req, res) => {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
        res.status(400);
        throw new Error("plz fill all")
    } else {
        const note = new Note({ user: req.user._id, title, content, category });
        const createdNote = await note.save();
        res.status(201).json(createdNote)
    }
})

const getNoteById = asynchandler(async (req, res) => {
    const note = await Note.findById(req.params.id);

    if (note) {
        res.json(note)
    } else {
        res.status(404).json({ message: "note njot found" })
    }
})

const UpdateNote = asynchandler(async (req, res) => {
    const { title, content, category } = req.body;
    const note = await Note.findById(req.params.id);
    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("cant perform this action");
    }
    if (note) {
        note.title = title;
        note.content = content;
        note.category = category;

        const UpdatedNote = await note.save();
        res.json(UpdatedNote)
    } else {
        res.status(404);
        throw new Error("Note not found");
    }

})

const DeleteNote = asynchandler(async (req, res) => {
    const note = await Note.findById(req.params.id);
    if (note.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error("cant perform this action");
    }
    if(note){
        await note.remove();
        res.json({message:"note remove"});
    }else{
        res.status(404);
        throw new Error("Note not found"); 
    }
})

module.exports = { getNotes, createNote, getNoteById, UpdateNote ,DeleteNote }