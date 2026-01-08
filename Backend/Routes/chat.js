// Creating a test route to test the database connection

import Thread from "../model/Thread.js";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import GetSmartAiResponse from "../utils/smartai.js";
import GenerateTitle from "../utils/generateTitle.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "mno",
      title: "Testing thread",
    });

    const response = await thread.save();
    res.send(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Fails to save data in database" });
  }
});

// Chat Route
router.post("/chat", async (req, res) => {
  try {
    const { threadId, message } = req.body;
    if(!message) {
        res.status(400).json({error: "Missing message"})
    }

    let thread = null;
    if (threadId) {
      thread = await Thread.findOne({ threadId });
    }   

    if (thread == null) {
      const Title = await GenerateTitle(message.content);
        const newThread = new Thread({
        threadId: uuidv4(),
        title: Title,
      });
      thread = await newThread.save();
    }

    await thread.messages.push(message);
    await thread.save();

    const assistantResponse = await GetSmartAiResponse(message.content);
    thread.messages.push({content: assistantResponse , role: "assistant"});
    thread.updatedAt = new Date();
    await thread.save();
    res.status(200).json({ success: "Message saved in the database"});
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Route to get all the Threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find().sort({ updatedAt: -1 });
    res.send(threads);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ error: "Error occur at finding the thread on database" });
  }
});

// Route to get messages of Individual thread
router.get("/thread/:id", async (req, res) => {
  try {
    const threadID = req.params.id;
    const thread = await Thread.findOne({threadId : threadID });

    if (!thread) {
      res.status(404).json({ error: "Thread Not Found" });
    }

    res.send(thread.messages);
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .json({ error: "Error occur at finding messages of Individual thread" });
  }
});

// Delete the Thread
router.delete("/thread/:id", async (req, res) => {
  try {
    const threadID = req.params.id;
    const thread = await Thread.findOneAndDelete({ threadID });

    if (!thread) {
      res.status(404).json("Thread Not Found");
    }

    console.log(thread.title, "Deleted Successfully");
    res.status(200).json({ success: `${thread.title} Deleted Successfully` });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error occur during deleting the thread." });
  }
});

export default router;
