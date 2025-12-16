"use strict";

/**
 * Get unique error field name
 */
const uniqueMessage = error => {
    let output;
    try {
        let fieldName = error.message.substring(
            error.message.lastIndexOf(".$") + 2,
            error.message.lastIndexOf("_1")
        );
        output =
            fieldName.charAt(0).toUpperCase() +
            fieldName.slice(1) +
            " already exists";
    } catch (ex) {
        output = "Unique field already exists";
    }

    return output;
};

/**
 * Get the erroror message from error object
 */
exports.errorHandler = error => {
    let message = "";

    if (error.code) {
        switch (error.code) {
            case 11000:
            case 11001:
                message = uniqueMessage(error);
                break;
            default:
                message = "Something went wrong";
        }
    } else {
        for (let errorName in error.errorors) {
            if (error.errorors[errorName].message)
                message = error.errorors[errorName].message;
        }
    }

    return message;
};



// by deep seek
const mongoose = require("mongoose");

exports.validateMessageInput = (data) => {
  const errors = [];

  if (!data.toUserId || !mongoose.Types.ObjectId.isValid(data.toUserId)) {
    errors.push("Invalid user ID");
  }

  if (!data.message || typeof data.message !== "string") {
    errors.push("Message must be a string");
  } else {
    const trimmed = data.message.trim();
    if (trimmed.length === 0) {
      errors.push("Message cannot be empty");
    }
    if (trimmed.length > 1000) {
      errors.push("Message too long (max 1000 characters)");
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

exports.validateMessageId = (messageId, userId) => {
  const errors = [];

  if (!messageId || !mongoose.Types.ObjectId.isValid(messageId)) {
    errors.push("Invalid message ID");
  }

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    errors.push("Invalid user ID");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

exports.validateChatPartner = (userId) => {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return {
      isValid: false,
      error: "Invalid user ID"
    };
  }
  return { isValid: true };
};