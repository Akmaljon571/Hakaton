const mongoose = require("mongoose");
const CustomError = require("../../utils/custom_error");
const { folderModel } = require("../../models");
const { formatParamsList } = require("../../global/file-path");

module.exports.folderObjectRepository = () => {
  return Object.freeze({
    insert,
    findAll,
    findIdList,
    findById,
    findParentList,
    findOne,
    removeFolder,
    findWithParend,
    updateOne,
    update,
    removeMeter
  });

  async function insert(args) {
    const newFolderDocument = await folderModel.create(args);

    return newFolderDocument;
  }

  async function findById(id) {
    return await folderModel.findById(id);
  }

  async function findAll(query, list) {
    try {
      const limit = query && query.limit ? Number(query.limit) : 150;

      const pipArray = [
        {
          $match: {
            $or: [{ parent_id: { $exists: false } }, { parent_id: null }],
          },
        },
        {
          $lookup: {
            from: "meter",
            localField: "meters",
            foreignField: "_id",
            as: "meter_detail",
          },
        },
        {
          $lookup: {
            from: "folders",
            localField: "_id",
            foreignField: "parent_id",
            as: "child_folders",
          },
        },
        {
          $unwind: {
            path: "$meter_detail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: {
            date: -1,
          },
        },
        {
          $limit: limit,
        },
      ];


      if (list && list.length !== 0) {
        pipArray.unshift({
          $match: {
            $expr: {
              $in: ["$_id", list.map(id => new mongoose.Types.ObjectId(id))]
            }
          }
        });
      }

      const folders = await folderModel.aggregate(pipArray, {
        maxTimeMS: 50000,
      });
      return folders;
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function findWithParend(parent_id) {
    try {
      return await folderModel.aggregate([
        { $match: { parent_id: new mongoose.Types.ObjectId(parent_id) } },
        {
          $lookup: {
            from: "lastjoins",
            localField: "meter",
            foreignField: "meter",
            as: "lastJournalData"
          }
        }
      ])
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function findParentList() {
    try {
      return await folderModel.find({ parent_id: null })
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function findOne(id) {
    try {
      const aggregationPipeline = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id)
          }
        },
        {
          $lookup: {
            from: "meters",
            let: { meter_id: "$meter" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$_id", "$$meter_id"] }
                }
              },
              {
                $lookup: {
                  from: "parameters",
                  localField: "_id",
                  foreignField: "meter",
                  as: "params"
                }
              }
            ],
            as: "meter_detail"
          }
        },
        {
          $lookup: {
            from: "folders",
            localField: "_id",
            foreignField: "parent_id",
            as: "child_folders"
          }
        },
        {
          $unwind: {
            path: "$meter_detail",
            preserveNullAndEmptyArrays: true
          }
        }
      ];

      const folder = await folderModel.aggregate(aggregationPipeline);

      if (folder[0].meter_detail && folder[0].meter_detail.params) {
        const block = formatParamsList();
        const arr = {};

        for (const value of folder[0].meter_detail.params) {
          for (const value2 of block.indicators_block) {
            const obis = value.channel_full_id.split('.').slice(0, 2).join('.')
            if (value.status == 'active' && obis == value2.channel_full_id) {
              arr[value2.channel_full_id] = value2;
            }
          }
        }

        folder[0].meter_detail.params = Object.values(arr);
      }

      return folder[0];
    } catch (error) {
      console.error(error);
      throw new CustomError(500, error.message);
    }
  }

  async function updateOne(id, data, isMeter = false) {
    try {
      let folderDocument
      if (isMeter) {
        folderDocument = await folderModel.updateOne({
          meter: new mongoose.Types.ObjectId(id)
        }, data);
      } else {
        folderDocument = await folderModel.updateOne({
          _id: new mongoose.Types.ObjectId(id)
        }, data);
      }
      return folderDocument;
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function update(_id, data) {
    try {
      await folderModel.updateOne({ _id }, data);
    } catch (err) {
      throw new CustomError(500, err.message)
    }
  }

  async function findIdList(id) {
    try {
      const list = { meters: [], folders: [] }

      const fn = async (id) => {
        list.folders.push(id)
        const aggregationPipeline = [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(id)
            }
          },
          {
            $lookup: {
              from: "folders",
              localField: "_id",
              foreignField: "parent_id",
              as: "child_folders"
            }
          }
        ];

        const folder = await folderModel.aggregate(aggregationPipeline);
        if (!folder[0]) return

        for (const value of folder[0].child_folders) {
          if (value.folder_type == 'meter') {
            list.meters.push(value.meter)
          } else if (value.folder_type == 'folder') {
            await fn(value._id)
          }
        }
      }
      await fn(id)

      return list;
    } catch (error) {
      console.error(error);
      throw new CustomError(500, error.message);
    }
  }

  async function removeMeter(id) {
    await folderModel.deleteOne({ meter: id })
  }

  async function removeFolder(_id) {
    await folderModel.deleteOne({ _id })
  }
};
