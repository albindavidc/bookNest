"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
/*************  ✨ Codeium Command ⭐  *************/
/**
 * Connects to the MongoDB Atlas cluster using the default connection string.
 * If the connection is successful, it logs a success message.
 * If the connection fails, it logs an error message and terminates the process.
 *
 * @returns {Promise<void>} A promise that resolves when connected to the MongoDB Atlas cluster.
 */
/******  a18fc90c-c25b-47af-8c18-f99016c81542  *******/        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));

const connectToDatabase = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const uri = "mongodb://localhost:27017/";
      yield mongoose_1.default.connect(uri, Object.assign({}, { useNewUrlParser: true, useUnifiedTopology: true }));
      console.log("connected to MongoDB Compass successfully");
    } catch (error) {
      console.log("Error connecting to MongoDB Compass:", error);
      process.exit(1);
    }
  });


  
exports.default = connectToDatabase;
