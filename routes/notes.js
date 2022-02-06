const express = require('express')
const router = express.Router();
const Notes = require('../modules/Notes');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


//ROUTE-1
//Fetch all notes from database using GET: localhost:5000/api/notes/fetchallnotes. Login requried
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const allNotes = await Notes.find({ user: req.user.id });

        res.json(allNotes);
    } catch (error) {
        res.status(500).send("Oops!! Some error occured. Please try again later.");
    }

})

//ROUTE-2
//Create a note of a user using POST: localhost:5000/api/notes/fetchallnotes. Login requried
router.post('/createnote', fetchuser, [

    //Validate the given details.
    body('title', 'Enter valid title').isLength({ min: 3 }),
    body('description', 'Enter valid description').isLength({ min: 5 })
], async (req, res) => {

    //If there are errors, returns Bad request and the errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //Create a new note
    try {
        let currentNote = await Notes.create({
            user: req.user.id,
            title: req.body.title,
            description: req.body.description,
            tag: req.body.tag
        })

        const savedNote = await currentNote.save();
        res.json(savedNote);
    } catch (error) {
        res.status(500).send("Oops!! Some error occured. Please try again later.");
    }
})


//ROUTE-3 
//Update a note. PUT: localhost:5000/api/notes/updatenote. Login requried
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, description, tag } = req.body;

    try {
        const note_buff = {};
        if (title) { note_buff.title = title };
        if (description) { note_buff.description = description };
        if (tag) { note_buff.tag = tag };

        //Find the note
        let note = await Notes.findById(req.params.id);

        if (!note) { return res.status(404).send("Note not found!!") }

        if (note.user.toString() !== req.user.id) {
            res.status(401).send("Access denied!!");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: note_buff }, { new: true });

        res.json({ note });

    } catch (error) {
        res.status(500).send("Oops!! Some error occured. Please try again later.");
    }

})

//ROUTE-4
//Delete a Note. DELETE: localhost:5000/api/notes/deletenote. Login requried
router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    try {
        //Find the note
        let note = await Notes.findById(req.params.id);

        if (!note) { return res.status(404).send("Note not found!!") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Access denied!!");
        }

        note = await Notes.findByIdAndDelete(req.params.id);

        // res.json({ Success: "Note has been deleted successfully!!" }, note);
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        res.status(500).send("Oops!! Some error occured. Please try again later.");
    }

})
module.exports = router