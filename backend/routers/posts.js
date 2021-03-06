const express = require('express');
const PostController = require('../controllers/post');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const router = express.Router();


router.post("",
  checkAuth,
  extractFile,
  PostController.createPost
);

router.get("",
  PostController.getAllPosts
);
router.get("/:id",
  PostController.getOnePost
);
router.patch("/:id",
  checkAuth,
  extractFile,
  PostController.updatePost
);

router.delete("/:id",
  checkAuth,
  PostController.deletePost
);

module.exports = router;
