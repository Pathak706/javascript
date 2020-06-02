const schedule = require('node-schedule');
const moment = require('moment');
const models = require('../models');
const _ = require('lodash');
const fs = require('fs');
let rule = new schedule.RecurrenceRule();
const roulleteRed = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
const roulleteBlack = [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26];
const roulleteGreen = [0];

const out1to12Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const out13to24Numbers = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
const out25to36Numbers = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];
const out1to18Numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const out19to36Numbers = [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36];

const outEvenNumbers = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36];
const outOddNumbers = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35];
const outRedNumbers = [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3];
const outBlackNumbers = [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26];

const out2to1_1Numbers = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
const out2to1_2Numbers = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
const out2to1_3Numbers = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
const pushService = require('../sockets/sockets');

rule.second = 15;


module.exports = function (io) {

  const toNumericPairs = input => {
    const entries = Object.entries(input);
    for (let entry of entries) entry[0] = +entry[0];
    return entries;
  }

  function doJob(callback) {
    const date = moment().local().format("DD-MM-YY_HH:mm:ss");
    const time = moment().local().format("HH:mm:ss");
    const round_id = "ri_".concat(date);
    const randomNumber = Number((Math.random() * (32 - 0) + 0).toFixed());
    let indexRed = roulleteRed.indexOf(randomNumber);
    let indexBlack = roulleteBlack.indexOf(randomNumber);
    let indexGreen = roulleteGreen.indexOf(randomNumber);
    let typeOFGame = '';
    console.log("Indexed Value");
    console.log(indexRed);
    console.log(indexGreen);
    console.log(indexBlack);
    models.users_setting.find({
      where: {
        user_id: 1
      }
    }).then(async result => {
      typeOFGame = result.payout_win;
    });
    if (indexRed !== -1) {
      console.log("Red");
      string = "Red";
      const insertBody = {
        roundid: round_id,
        number: randomNumber,
        color: string,
        time
      };

      models.current_game.findAll({
        limit: 7,
        order: [['created_at', 'DESC']]
      })
        .then(games => {
          console.log("current round_id", round_id);
          console.log("last game id Red", games[0].roundid);

          models.useradmin_tfr.findAll({
            // attributes: ['string'],
            where: {
              round_id: games[0].roundid
            }
          }).then(async rows => {
            console.log("Rows selection ", rows);
            const add_result = [];
            console.log("last game Data Red", JSON.stringify(rows, null, 3));
            const new_array = [];
            const out1to12Array = [];
            const out13to24Array = [];
            const out25to36Array = [];
            const out1to18Array = [];
            const out19to36Array = [];
            const outEvenArray = [];
            const outOddarray = [];
            const outredArray = [];
            const outBlackArray = [];
            const out2to1_1Array = [];
            const out2to1_2Array = [];
            const out2to1_3Array = [];
            const payoutArray = [];
            const userIdArray = [];
            const selectedValuesArray = [];
            console.log("Rows", JSON.stringify(rows));
            rows.forEach(row => {
              // add_result.push(JSON.parse(row.string));
              //console.log("row data",JSON.parse(row.string));
              // new_array.push(JSON.parse(row.string));
              console.log("Row", JSON.stringify(row));
              userIdArray.push(row.user_id);
              const data = JSON.parse(row.string);
              const newNumbersArray = data.numbers;
              const convertedArray = [];
              const filteredNumber = [];
              newNumbersArray.forEach((num, index) => {
                convertedArray.push(Number(num));
                if (num !== '0') {
                  const newData = { index, number: Number(num) }
                  filteredNumber.push(newData)
                }
              });

              console.log("string array", JSON.stringify(data));
              // newNumbersArray.forEach((number, index) => {
              //   console.log("numbers array",number, index);
              //

              new_array.push(convertedArray);

              out1to12Array.push(Number(data.out1to12));
              if (data.out1to12 !== '0') {
                const out1to12 = Number(data.out1to12);
                const newData = {
                  index: 'out1to12',
                  number: out1to12
                };
                filteredNumber.push(newData);
              }
              out13to24Array.push(Number(data.out13to24));
              if (data.out13to24 !== '0') {
                const out13to24 = Number(data.out13to24);
                const newData = {
                  index: 'out13to24',
                  number: out13to24
                };
                filteredNumber.push(newData);
              }
              if (data.out13to24 !== '0') {
                const out13to24 = Number(data.out13to24);
                const newData = {
                  index: 'out13to24',
                  number: out13to24
                };
                filteredNumber.push(newData);
              }
              out25to36Array.push(Number(data.out25to36));
              if (data.out25to36 !== '0') {
                const out25to36 = Number(data.out25to36);
                const newData = {
                  index: 'out25to36',
                  number: out25to36
                };
                filteredNumber.push(newData);
              }
              if (data.out25to36 !== '0') {
                const out25to36 = Number(data.out25to36);
                const newData = {
                  index: 'out25to36',
                  number: out25to36
                };
                filteredNumber.push(newData);
              }
              out1to18Array.push(Number(data.out1to18));
              if (data.out1to18 !== '0') {
                const out1to18 = Number(data.out1to18);
                const newData = {
                  index: 'out1to18',
                  number: out1to18
                };
                filteredNumber.push(newData);
              }

              out19to36Array.push(Number(data.out19to36));
              if (data.out1to18 !== '0') {
                const out1to18 = Number(data.out1to18);
                const newData = {
                  index: 'out1to18',
                  number: out1to18
                };
                filteredNumber.push(newData);
              }
              outEvenArray.push(Number(data.outEven));
              if (data.outEven !== '0') {
                const outEven = Number(data.outEven);
                const newData = {
                  index: 'outEven',
                  number: outEven
                };
                filteredNumber.push(newData);
              }
              outOddarray.push(Number(data.outOdd));
              if (data.outOdd !== '0') {
                const outOdd = Number(data.outOdd);
                const newData = {
                  index: 'outOdd',
                  number: outOdd
                };
                filteredNumber.push(newData);
              }

              outredArray.push(Number(data.outRed));
              if (data.outRed !== '0') {
                const outRed = Number(data.outRed);
                const newData = {
                  index: 'outRed',
                  number: outRed
                };
                filteredNumber.push(newData);
              }
              outBlackArray.push(Number(data.outBlack));
              if (data.outBlack !== '0') {
                const outBlack = Number(data.outBlack);
                const newData = {
                  index: 'outBlack',
                  number: outBlack
                };
                filteredNumber.push(newData);
              }
              if (data.outBlack !== '0') {
                const outBlack = Number(data.outBlack);
                const newData = {
                  index: 'outBlack',
                  number: outBlack
                };
                filteredNumber.push(newData);
              }
              out2to1_1Array.push(Number(data.out2to1_1));
              if (data.out2to1_1 !== '0') {
                const out2to1_1 = Number(data.out2to1_1);
                const newData = {
                  index: 'out2to1_1',
                  number: out2to1_1
                };
                filteredNumber.push(newData);
              }
              out2to1_2Array.push(Number(data.out2to1_2));
              if (data.out2to1_2 !== '0') {
                const out2to1_2 = Number(data.out2to1_2);
                const newData = {
                  index: 'out2to1_2',
                  number: out2to1_2
                };
                filteredNumber.push(newData);
              }

              out2to1_3Array.push(Number(data.out2to1_3));
              if (data.out2to1_3 !== '0') {
                const out2to1_3 = Number(data.out2to1_3);
                const newData = {
                  index: 'out2to1_3',
                  number: out2to1_3
                };
                filteredNumber.push(newData);
              }
              selectedValuesArray.push(filteredNumber);
              payoutArray.push(Number(data.payOut));
            })

            console.log("selectd Values Array", selectedValuesArray);
            console.log(`${userIdArray}: userids, ${userIdArray.length} : length`)

            console.log(`${new_array}: Final array,  ${new_array.length}: length`);
            const resulArrayNew = _.unzipWith(new_array, _.add);
            console.log("Result New array", resulArrayNew);
            const sum_out1to12 = _.reduce(out1to12Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out13to24 = _.reduce(out13to24Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out25to36 = _.reduce(out25to36Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out1to18 = _.reduce(out1to18Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out19to36 = _.reduce(out19to36Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_outEven = _.reduce(outEvenArray, function (acc, cur) {
              return acc + cur;
            });

            const sum_outOdd = _.reduce(outOddarray, function (acc, cur) {
              return acc + cur;
            });

            const sum_outred = _.reduce(outredArray, function (acc, cur) {
              return acc + cur;
            });

            const sum_outBlack = _.reduce(outBlackArray, function (acc, cur) {
              return acc + cur;
            });

            const sum_out2to1_1 = _.reduce(out2to1_1Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out2to1_2 = _.reduce(out2to1_2Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out2to1_3 = _.reduce(out2to1_3Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_payout = _.reduce(payoutArray, function (acc, cur) {
              return acc + cur;
            });

            const multipliedArray = resulArrayNew.map(function (num) {
              return num * 35;
            })
            finalSelected = [];
            selectedValuesArray.forEach((selectValue, index) => {
              userId = userIdArray[index]
              console.log("user id", userId);
              const finalSel = {
                userId,
                selectValue
              };
              finalSelected.push(finalSel);
            })
            console.log(`${JSON.stringify(finalSelected, null, 3)} : finalSelected`);
            const bettingArray = {
              numbers: multipliedArray,
              out1to12: sum_out1to12 * 3,
              out13to24: sum_out13to24 * 3,
              out25to36: sum_out25to36 * 3,
              out1to18: sum_out1to18 * 2,
              out19to36: sum_out19to36 * 2,
              outEven: sum_outEven * 2,
              outOdd: sum_outOdd * 2,
              outRed: sum_outred * 2,
              outBlack: sum_outBlack * 2,
              out2to1_1: sum_out2to1_1 * 3,
              out2to1_2: sum_out2to1_2 * 3,
              out2to1_3: sum_out2to1_3 * 3,
              payOut: sum_payout
            }
            console.log("betting Array", bettingArray);
            let minimum_amount = _.min(multipliedArray);
            let minimum_amountNew = _.min(multipliedArray);
            let minimum_mnt_index = _.indexOf(multipliedArray, _.min(multipliedArray));
            console.log("minimum amount", minimum_amount);
            let minimum_amounts_array = [];
            multipliedArray.forEach(function (num, index) {
              console.log("num into foreach", num);
              if (num <= minimum_amountNew) {
                console.log("condition true for", minimum_amount);
                if (_.includes(out1to12Numbers, index)) {
                  minimum_amount += sum_out1to12 * 3;
                }
                if (_.includes(out13to24Numbers, index)) {
                  minimum_amount += sum_out13to24 * 3;
                }
                if (_.includes(out25to36Numbers, index)) {
                  minimum_amount += sum_out25to36 * 3;
                }
                if (_.includes(out1to18Numbers, index)) {
                  minimum_amount += sum_out1to18 * 2;
                }
                if (_.includes(out19to36Numbers, index)) {
                  minimum_amount += sum_out19to36 * 2;
                }
                if (_.includes(outEvenNumbers, index)) {
                  minimum_amount += sum_outEven * 2;
                }
                if (_.includes(outOddNumbers, index)) {
                  minimum_amount += sum_outOdd * 2;
                }
                if (_.includes(outRedNumbers, index)) {
                  minimum_amount += sum_outred * 2;
                }
                if (_.includes(outBlackNumbers, index)) {
                  minimum_amount += sum_outBlack * 2;
                }
                if (_.includes(out2to1_1Numbers, index)) {
                  minimum_amount += sum_out2to1_1 * 3;
                }
                if (_.includes(out2to1_2Numbers, index)) {
                  minimum_amount += sum_out2to1_2 * 3;
                }
                if (_.includes(out2to1_3Numbers, index)) {
                  minimum_amount += sum_out2to1_3 * 3;
                }
                const winingamtListArray = {
                  index: index,
                  amount: minimum_amount
                }
                minimum_amounts_array.push(winingamtListArray);
                minimum_amount = minimum_amountNew;
              }
            });
            console.log("wining Amount", minimum_amounts_array);
            var min_value = _.minBy(minimum_amounts_array, 'amount');
            console.log("wining min value", min_value);
            console.log("type of min value array", typeof (min_value));
            let resultantValue = [];
            let gameRoundId = '';
            let gameOldNumber = '';
            let gameNewWiningNumber = '';
            /*Random Logic*/
            if (typeOFGame == "random") {
              console.log("Random Number ");
              // pathakrahul2704 work => check for admin number punch if random payout is set
              const winingNumber = games[0].custom_number ? games[0].custom_number : games[0].number;
              min_value = {
                index: winingNumber,
                amount: sum_payout
              }
            }
            if (min_value) {
              if (games[0].number != min_value.index || sum_payout >= min_value.amount) {
                let num_color = '';
                // pathakrahul2704 work => check for admin number punch if least payout is set
                min_value.index = games[0].custom_number ? games[0].custom_number : min_value.index;
                const chk_red = roulleteRed.indexOf(min_value.index);
                const chk_black = roulleteBlack.indexOf(min_value.index);
                const chk_green = roulleteGreen.indexOf(min_value.index);
                if (chk_red !== -1) {
                  console.log("check color red", chk_red);
                  num_color = 'Red';
                }
                else if (chk_black !== -1) {
                  console.log("check color Black", chk_black);
                  num_color = 'Black';
                }
                else if (chk_green !== -1) {
                  console.log("check color Green", chk_green);
                  num_color = 'Green';
                }
                else {
                  console.log("check color else", chk_green);
                  num_color = 'Green';
                }
                models.users_setting.find({
                  where: {
                    user_id: 1
                  }
                }).then(async result => {
                  if (result.payout_win == 'least') {
                    const updated = await models.current_game.update({
                      number: min_value.index,
                      color: num_color
                    }, {
                      where: {
                        roundid: games[0].roundid
                      }
                    });
                  }
                });
                let finalUsersArray = [];
                finalSelected.forEach(selectvals => {
                  const { userId, selectValue } = selectvals;
                  console.log("final selected array into foreach ", JSON.stringify(selectValue, null, 3));
                  const sel_newArry = [];
                  const sel_amtArry = [];
                  console.log("select value type of", typeof (selectValue));
                  selectValue.forEach(num => {
                    sel_newArry.push(num.index);
                    sel_amtArry.push(num.number);
                  })

                  console.log("sel new Array", sel_newArry);
                  console.log("sel amount new Array", sel_amtArry);
                  const newIndex = _.includes(sel_newArry, min_value.index)
                  console.log(`${newIndex} : new index, ${min_value.index} : min value index`);
                  console.log("New Index1 " + newIndex);
                  if (newIndex) {
                    console.log("New Index1 I m in " + newIndex);
                    const newAmountIndex = sel_newArry.indexOf(min_value.index);
                    const betAmountuser = selectValue[newAmountIndex].number;
                    console.log("new Indexes", selectValue[newAmountIndex].number);
                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex,
                      be_amt_user: betAmountuser * 35
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);
                    //finalUsersArray
                  }
                  //else {
                  console.log("into else of sel new array with", sel_newArry);
                  if (_.includes(sel_newArry, 'out1to12') && _.includes(out1to12Numbers, min_value.index)) {

                    const newAmountIndex_new_old = 'out1to12';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);

                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);
                  }
                  if (_.includes(sel_newArry, 'out13to24') && _.includes(out13to24Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out13to24';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);
                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);
                  }
                  if (_.includes(sel_newArry, 'out25to36') && _.includes(out25to36Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out25to36';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out1to18') && _.includes(out1to18Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out1to18';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out19to36') && _.includes(out19to36Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out19to36';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outEven') && _.includes(outEvenNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outEven';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outOdd') && _.includes(outOddNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outOdd';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outRed') && _.includes(outRedNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outRed';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outBlack') && _.includes(outBlackNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outBlack';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out2to1_1') && _.includes(out2to1_1Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_1';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }
                  if (_.includes(sel_newArry, 'out2to1_2') && _.includes(out2to1_2Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_2';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }

                  if (_.includes(sel_newArry, 'out2to1_3') && _.includes(out2to1_3Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_3';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }

                  //}
                  // const {user, numbers} = selectvals;
                  // numbers.forEach(number=>{
                  //
                  // })
                })
                console.log('final Users Array', finalUsersArray);
                var result = finalUsersArray.reduce(function (r, o) {
                  var k = o.userId;   // unique `loc` key
                  if (r[k] || (r[k] = [])) r[k].push(o.be_amt_user);
                  return r;
                }, {});



                const lastDatawithuser = toNumericPairs(result);
                lastDatawithuser.forEach((val, index) => {
                  var userid = val[0];
                  var nums = val[1];
                  var final_amt = _.sum(nums);

                  const finalCalculation = {
                    userId: userid,
                    total_amt: final_amt
                  }
                  console.log("Final Calculation", finalCalculation);
                  models.users.findOne({
                    where: {
                      id: userid
                    }
                  }).then(async user => {
                    console.log("Update Balance of Users 1");
                    const newBalance = Number(user.balance) + Number(final_amt);
                    const updated = await models.users.update({
                      balance: newBalance,
                    }, {
                      where: {
                        id: userId
                      }
                    });
                    const updated1 = await models.transactions.update({
                      earned: final_amt,
                    }, {
                      where: {
                        user_id: userId,
                        round_id: games[0].roundid
                      }
                    });
                    if (updated) {
                      resultantValue.push(finalCalculation);
                    }
                  })
                });
                console.log("final user array", result);
                console.log("to numeric pairs", toNumericPairs(result));
                console.log("final resultant array", resultantValue);


              }
              console.log("updated round ID", games[0].roundid);
              console.log("games old number", games[0].number);
              console.log("games new number with min amount", min_value.index);
              console.log("games winning number amount", min_value.amount);

            }
            gameRoundId = games[0].roundid;
            gameOldNumber = games[0].number;
            if (min_value)
            // if(typeOFGame == 'least')/*Random Logic*/
            {
              if (games[0].number != min_value.index || sum_payout >= min_value.amount) {
                gameNewWiningNumber = min_value.index;
              }
              else {
                gameNewWiningNumber = games[0].number;
              }

            }
            else {
              console.log("Generating Random 1");
              gameNewWiningNumber = games[0].number;
            }
            console.log("game Old Wining Number", games[0].number);
            console.log("game New Wining Number", gameNewWiningNumber);
            console.log("resultant Value with user id and amount", resultantValue);

            //const finalResultArr = [];
            // resultantValue.forEach(resultant =>{
            //   const {userId,total_amt}=resultant;
            //   models.users.findOne({
            //     where:{
            //       id:userId
            //     }
            //   }).then(async userdata => {
            //       const newBalance=Number(userdata.balance)+Number(total_amt);
            //     const updated = await models.users.update({
            //               balance: newBalance,
            //             }, {
            //               where: {
            //                 id:userId
            //               }
            //             });
            //             console.log("updated value",updated);
            //     if (updated) {
            //       console.log("into updated value of newBalance");
            //       const nod =  {
            //         userId,
            //         newBalance: newBalance
            //       }
            //       finalResultArr.push(nod);
            //       console.log("into updated value final Result Arr ",finalResultArr);
            //     } else {
            //       const nod =  {
            //         userId,
            //         newBalance: total_amt
            //       }
            //       finalResultArr.push(nod);
            //     }
            //   }).catch(err => {
            //     finalResultArr.push(resultant);
            //   })
            // })
            //console.log("const final Result Arr",finalResultArr);
            // console.log("added Result array Red",add_result);
            console.log("Resultant value: ", resultantValue);
            const final_body = {
              roundid: gameRoundId,
              number: gameNewWiningNumber,
              color: insertBody.string,
              time: insertBody.time,
            }
            const updated1 = await models.transactions.update({
              ball: gameNewWiningNumber,

            }, {
              where: {
                round_id: games[0].roundid
              }
            });
            console.log("final body", final_body);
            const inserted = await models.current_game.create(insertBody);

            if (inserted) {
              const abcd = await models.current_game.findAll({
                // limit: 7,
                offset: 1, limit: 7,
                order: [['created_at', 'DESC']]
              });
              //console.log(inserted);
              const socketBody = {
                //current_game: insertBody,
                current_game: insertBody,
                last7Games: abcd,
                newWiningNumber: gameNewWiningNumber,
                winnersResultData: resultantValue,
                //winnersResultDataAll:finalResultArr
              }

              console.log("socket body", JSON.stringify(socketBody, null, 3));
              pushService.pushMessage(io, socketBody);
              callback();
            } else {
              console.log("Failed to insert");
              callback();
            }
          });


        })


    } else if (indexBlack !== -1) {
      console.log("Black");
      string = "Black";
      const insertBody = {
        roundid: round_id,
        number: randomNumber,
        color: string,
        time
      };

      models.current_game.findAll({
        limit: 7,
        order: [['created_at', 'DESC']]
      })
        .then(games => {
          console.log("current round_id", round_id);
          console.log("last game id Black", games[0].roundid);
          models.useradmin_tfr.findAll({
            // attributes: ['string'],
            where: {
              round_id: games[0].roundid
            }
          }).then(async rows => {
            console.log("Rows selection ", rows);
            const add_result = [];
            console.log("last game Data Black", JSON.stringify(rows, null, 3));
            const new_array = [];
            const out1to12Array = [];
            const out13to24Array = [];
            const out25to36Array = [];
            const out1to18Array = [];
            const out19to36Array = [];
            const outEvenArray = [];
            const outOddarray = [];
            const outredArray = [];
            const outBlackArray = [];
            const out2to1_1Array = [];
            const out2to1_2Array = [];
            const out2to1_3Array = [];
            const payoutArray = [];
            const userIdArray = [];
            const selectedValuesArray = [];
            console.log("Rows", JSON.stringify(rows));


            rows.forEach(row => {
              // add_result.push(JSON.parse(row.string));
              //console.log("row data",JSON.parse(row.string));
              // new_array.push(JSON.parse(row.string));
              console.log("Row", JSON.stringify(row));
              userIdArray.push(row.user_id);
              const data = JSON.parse(row.string);
              const newNumbersArray = data.numbers;
              const convertedArray = [];
              const filteredNumber = [];
              newNumbersArray.forEach((num, index) => {
                convertedArray.push(Number(num));
                if (num !== '0') {
                  const newData = { index, number: Number(num) }
                  filteredNumber.push(newData)
                }
              });


              console.log("string array", JSON.stringify(data));
              // newNumbersArray.forEach((number, index) => {
              //   console.log("numbers array",number, index);
              //

              new_array.push(convertedArray);

              out1to12Array.push(Number(data.out1to12));
              if (data.out1to12 !== '0') {
                const out1to12 = Number(data.out1to12);
                const newData = {
                  index: 'out1to12',
                  number: out1to12
                };
                filteredNumber.push(newData);
              }

              out13to24Array.push(Number(data.out13to24));
              if (data.out13to24 !== '0') {
                const out13to24 = Number(data.out13to24);
                const newData = {
                  index: 'out13to24',
                  number: out13to24
                };
                filteredNumber.push(newData);
              }

              out25to36Array.push(Number(data.out25to36));
              if (data.out25to36 !== '0') {
                const out25to36 = Number(data.out25to36);
                const newData = {
                  index: 'out25to36',
                  number: out25to36
                };
                filteredNumber.push(newData);
              }

              out1to18Array.push(Number(data.out1to18));
              if (data.out1to18 !== '0') {
                const out1to18 = Number(data.out1to18);
                const newData = {
                  index: 'out1to18',
                  number: out1to18
                };
                filteredNumber.push(newData);
              }

              out19to36Array.push(Number(data.out19to36));
              if (data.out1to18 !== '0') {
                const out1to18 = Number(data.out1to18);
                const newData = {
                  index: 'out1to18',
                  number: out1to18
                };
                filteredNumber.push(newData);
              }
              outEvenArray.push(Number(data.outEven));
              if (data.outEven !== '0') {
                const outEven = Number(data.outEven);
                const newData = {
                  index: 'outEven',
                  number: outEven
                };
                filteredNumber.push(newData);
              }
              outOddarray.push(Number(data.outOdd));
              if (data.outOdd !== '0') {
                const outOdd = Number(data.outOdd);
                const newData = {
                  index: 'outOdd',
                  number: outOdd
                };
                filteredNumber.push(newData);
              }

              outredArray.push(Number(data.outRed));
              if (data.outRed !== '0') {
                const outRed = Number(data.outRed);
                const newData = {
                  index: 'outRed',
                  number: outRed
                };
                filteredNumber.push(newData);
              }
              outBlackArray.push(Number(data.outBlack));
              if (data.outBlack !== '0') {
                const outBlack = Number(data.outBlack);
                const newData = {
                  index: 'outBlack',
                  number: outBlack
                };
                filteredNumber.push(newData);
              }
              out2to1_1Array.push(Number(data.out2to1_1));
              if (data.out2to1_1 !== '0') {
                const out2to1_1 = Number(data.out2to1_1);
                const newData = {
                  index: 'out2to1_1',
                  number: out2to1_1
                };
                filteredNumber.push(newData);
              }
              out2to1_2Array.push(Number(data.out2to1_2));
              if (data.out2to1_2 !== '0') {
                const out2to1_2 = Number(data.out2to1_2);
                const newData = {
                  index: 'out2to1_2',
                  number: out2to1_2
                };
                filteredNumber.push(newData);
              }

              out2to1_3Array.push(Number(data.out2to1_3));
              if (data.out2to1_3 !== '0') {
                const out2to1_3 = Number(data.out2to1_3);
                const newData = {
                  index: 'out2to1_3',
                  number: out2to1_3
                };
                filteredNumber.push(newData);
              }
              payoutArray.push(Number(data.payOut));
              selectedValuesArray.push(filteredNumber);
            })

            console.log("selectd Values Array", selectedValuesArray);

            console.log(`${userIdArray}: userids, ${userIdArray.length} : length`)

            console.log(`${new_array}: Final array,  ${new_array.length}: length`);
            const resulArrayNew = _.unzipWith(new_array, _.add);
            console.log("Result New array", resulArrayNew);

            const sum_out1to12 = _.reduce(out1to12Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_out13to24 = _.reduce(out13to24Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_out25to36 = _.reduce(out25to36Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_out1to18 = _.reduce(out1to18Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_out19to36 = _.reduce(out19to36Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_outEven = _.reduce(outEvenArray, function (acc, cur) {
              return acc + cur;
            });


            const sum_outOdd = _.reduce(outOddarray, function (acc, cur) {
              return acc + cur;
            });


            const sum_outred = _.reduce(outredArray, function (acc, cur) {
              return acc + cur;
            });


            const sum_outBlack = _.reduce(outBlackArray, function (acc, cur) {
              return acc + cur;
            });


            const sum_out2to1_1 = _.reduce(out2to1_1Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_out2to1_2 = _.reduce(out2to1_2Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_out2to1_3 = _.reduce(out2to1_3Array, function (acc, cur) {
              return acc + cur;
            });


            const sum_payout = _.reduce(payoutArray, function (acc, cur) {
              return acc + cur;
            });

            const multipliedArray = resulArrayNew.map(function (num) {
              return num * 35;
            })
            finalSelected = [];
            selectedValuesArray.forEach((selectValue, index) => {
              userId = userIdArray[index]
              console.log("user id", userId);
              const finalSel = {
                userId,
                selectValue
              };

              finalSelected.push(finalSel);
            })
            console.log(`${JSON.stringify(finalSelected, null, 3)} : finalSelected`);
            const bettingArray = {
              numbers: multipliedArray,
              out1to12: sum_out1to12 * 3,
              out13to24: sum_out13to24 * 3,
              out25to36: sum_out25to36 * 3,
              out1to18: sum_out1to18 * 2,
              out19to36: sum_out19to36 * 2,
              outEven: sum_outEven * 2,
              outOdd: sum_outOdd * 2,
              outRed: sum_outred * 2,
              outBlack: sum_outBlack * 2,
              out2to1_1: sum_out2to1_1 * 3,
              out2to1_2: sum_out2to1_2 * 3,
              out2to1_3: sum_out2to1_3 * 3,
              payOut: sum_payout
            }
            console.log("betting Array", bettingArray);

            let minimum_amount = _.min(multipliedArray);
            let minimum_amountNew = _.min(multipliedArray);
            let minimum_mnt_index = _.indexOf(multipliedArray, _.min(multipliedArray));
            let minimum_amounts_array = [];
            multipliedArray.forEach(function (num, index) {
              if (num <= minimum_amountNew) {
                if (_.includes(out1to12Numbers, index)) {
                  minimum_amount += sum_out1to12 * 3;
                }
                if (_.includes(out13to24Numbers, index)) {
                  minimum_amount += sum_out13to24 * 3;
                }
                if (_.includes(out25to36Numbers, index)) {
                  minimum_amount += sum_out25to36 * 3;
                }
                if (_.includes(out1to18Numbers, index)) {
                  minimum_amount += sum_out1to18 * 2;
                }
                if (_.includes(out19to36Numbers, index)) {
                  minimum_amount += sum_out19to36 * 2;
                }
                if (_.includes(outEvenNumbers, index)) {
                  minimum_amount += sum_outEven * 2;
                }
                if (_.includes(outOddNumbers, index)) {
                  minimum_amount += sum_outOdd * 2;
                }
                if (_.includes(outRedNumbers, index)) {
                  minimum_amount += sum_outred * 2;
                }
                if (_.includes(outBlackNumbers, index)) {
                  minimum_amount += sum_outBlack * 2;
                }
                if (_.includes(out2to1_1Numbers, index)) {
                  minimum_amount += sum_out2to1_1 * 3;
                }
                if (_.includes(out2to1_2Numbers, index)) {
                  minimum_amount += sum_out2to1_2 * 3;
                }
                if (_.includes(out2to1_3Numbers, index)) {
                  minimum_amount += sum_out2to1_3 * 3;
                }

                const winingamtListArray = {
                  index: index,
                  amount: minimum_amount
                }
                minimum_amounts_array.push(winingamtListArray);
                minimum_amount = minimum_amountNew;
              }
            })
            console.log("wining Amount", minimum_amounts_array);

            var min_value = _.minBy(minimum_amounts_array, 'amount');
            console.log("wining min value", min_value);
            console.log("type of min value array", typeof (min_value));

            let resultantValue = [];
            let gameRoundId = '';
            let gameOldNumber = '';
            let gameNewWiningNumber = '';
            /*Random Logic*/
            if (typeOFGame == "random") {
              console.log("Random Number ");
              // pathakrahul2704 work => check for admin number punch if random payout is set              
              const winingNumber = games[0].custom_number ? games[0].custom_number : games[0].number;
              min_value = {
                index: winingNumber,
                amount: sum_payout
              }
            }
            if (min_value) {
              if (games[0].number != min_value.index || sum_payout >= min_value.amount) {
                let num_color = '';
                // pathakrahul2704 work => check for admin number punch if least payout is set
                min_value.index = games[0].custom_number ? games[0].custom_number : min_value.index;
                const chk_red = roulleteRed.indexOf(min_value.index);
                const chk_black = roulleteBlack.indexOf(min_value.index);
                const chk_green = roulleteGreen.indexOf(min_value.index);
                if (chk_red !== -1) {
                  console.log("check color red", chk_red);
                  num_color = 'Red';
                }
                else if (chk_black !== -1) {
                  console.log("check color Black", chk_black);
                  num_color = 'Black';
                }
                else if (chk_green !== -1) {
                  console.log("check color Green", chk_green);
                  num_color = 'Green';
                }
                else {
                  console.log("check color else", chk_green);
                  num_color = 'Green';
                }

                models.users_setting.find({
                  where: {
                    user_id: 1
                  }
                }).then(async result => {

                  if (result.payout_win == 'least') {
                    const updated = await models.current_game.update({
                      number: min_value.index,
                      color: num_color
                    }, {
                      where: {
                        roundid: games[0].roundid
                      }
                    });



                  }

                });
                let finalUsersArray = [];
                finalSelected.forEach(selectvals => {
                  const { userId, selectValue } = selectvals;
                  console.log("final selected array into foreach ", JSON.stringify(selectValue, null, 3));
                  const sel_newArry = [];
                  const sel_amtArry = [];
                  console.log("select value type of", typeof (selectValue));
                  selectValue.forEach(num => {

                    sel_newArry.push(num.index);
                    sel_amtArry.push(num.number);
                  })


                  console.log("sel new Array", sel_newArry);
                  console.log("sel amount new Array", sel_amtArry);
                  const newIndex = _.includes(sel_newArry, min_value.index)
                  console.log(`${newIndex} : new index, ${min_value.index} : min value index`);
                  if (newIndex) {
                    const newAmountIndex = sel_newArry.indexOf(min_value.index);
                    const betAmountuser = selectValue[newAmountIndex].number;
                    console.log("new Indexes", selectValue[newAmountIndex].number);
                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex,
                      be_amt_user: betAmountuser * 35
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);
                    //finalUsersArray
                  }
                  //else {
                  console.log("into else of sel new array with", sel_newArry);
                  if (_.includes(sel_newArry, 'out1to12') && _.includes(out1to12Numbers, min_value.index)) {

                    const newAmountIndex_new_old = 'out1to12';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);

                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }
                  if (_.includes(sel_newArry, 'out13to24') && _.includes(out13to24Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out13to24';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out25to36') && _.includes(out25to36Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out25to36';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out1to18') && _.includes(out1to18Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out1to18';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out19to36') && _.includes(out19to36Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out19to36';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outEven') && _.includes(outEvenNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outEven';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outOdd') && _.includes(outOddNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outOdd';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outRed') && _.includes(outRedNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outRed';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outBlack') && _.includes(outBlackNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outBlack';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out2to1_1') && _.includes(out2to1_1Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_1';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }
                  if (_.includes(sel_newArry, 'out2to1_2') && _.includes(out2to1_2Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_2';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }

                  if (_.includes(sel_newArry, 'out2to1_3') && _.includes(out2to1_3Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_3';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }

                  //}


                })

                console.log('final Users Array', finalUsersArray);
                var result = finalUsersArray.reduce(function (r, o) {
                  var k = o.userId;   // unique `loc` key
                  if (r[k] || (r[k] = [])) r[k].push(o.be_amt_user);
                  return r;
                }, {});



                const lastDatawithuser = toNumericPairs(result);
                lastDatawithuser.forEach((val, index) => {
                  var userid = val[0];
                  var nums = val[1];
                  var final_amt = _.sum(nums);

                  const finalCalculation = {
                    userId: userid,
                    total_amt: final_amt
                  }
                  console.log("Final Calculation", finalCalculation);
                  models.users.findOne({
                    where: {
                      id: userid
                    }
                  }).then(async user => {
                    console.log("Update Balance of Users 2");
                    const newBalance = Number(user.balance) + Number(final_amt);
                    const updated = await models.users.update({
                      balance: newBalance,
                    }, {
                      where: {
                        id: userId
                      }
                    });
                    const updated1 = await models.transactions.update({
                      earned: final_amt,
                    }, {
                      where: {
                        user_id: userId,
                        round_id: games[0].roundid
                      }
                    });
                    if (updated) {
                      resultantValue.push(finalCalculation);
                    }
                  })
                  //finalUser
                  //resultantValue.push(finalCalculation);
                })
                console.log("final user array", result);
                console.log("to numeric pairs", toNumericPairs(result));
                console.log("final resultant array", resultantValue);
                //const finaluserData=_.sumBy(finalUsersArray, function(o) { return o.be_amt_user; });
                //console.log("final user Data",finaluserData);
                //  selectedValuesArray.selectValue.forEach(select=>{
                //    console.log("select index",select.index);
                //    console.log("minvalue index",min_value.index);
                //      if(select.index == min_value.index)
                //      {
                //        console.log("json stringify selectedValuesArray",JSON.stringify(select,null,3))
                //      }
                // })


              }
              console.log("updated round ID", games[0].roundid);
              console.log("games old number", games[0].number);
              console.log("games new number with min amount", min_value.index);
              console.log("games winning number amount", min_value.amount);

            }

            gameRoundId = games[0].roundid;
            gameOldNumber = games[0].number;
            if (min_value)
            //if(typeOFGame == "least")//Random
            {
              if (games[0].number != min_value.index || sum_payout >= min_value.amount) {
                gameNewWiningNumber = min_value.index;
              }
              else {
                gameNewWiningNumber = games[0].number;
              }

            }
            else {
              console.log("Generating Random 2");
              gameNewWiningNumber = games[0].number;
            }
            console.log("game Old Wining Number", games[0].number);
            console.log("game New Wining Number", gameNewWiningNumber);
            console.log("resultant Value with user id and amount", resultantValue);

            console.log("resultant Value with user id and amount", resultantValue);

            //const finalResultArr = [];
            // resultantValue.forEach(resultant =>{
            //   const {userId,total_amt}=resultant;
            //   models.users.findOne({
            //     where:{
            //       id:userId
            //     }
            //   }).then(async userdata => {
            //       const newBalance=Number(userdata.balance)+Number(total_amt);
            //     const updated = await models.users.update({
            //               balance: newBalance,
            //             }, {
            //               where: {
            //                 id:userId
            //               }
            //             });
            //       console.log("updated value",updated);
            //     if (updated) {
            //       console.log("into updated value of newBalance");
            //       const nod =  {
            //         userId,
            //         newBalance: newBalance
            //       }
            //       finalResultArr.push(nod);
            //       console.log("into updated value final Result Arr ",finalResultArr);
            //     } else {
            //       const nod =  {
            //         userId,
            //         newBalance: total_amt
            //       }
            //       finalResultArr.push(nod);
            //     }
            //   }).catch(err => {
            //     finalResultArr.push(resultant);
            //   })
            // })


            // for (var i = 0; i < array.length; i++) {
            //   for (var i = 0; i < array.length; i++) {
            //     array[i]
            //   }
            // }
            // console.log("added Result array Black",add_result);
            const final_body = {
              roundid: gameRoundId,
              number: gameNewWiningNumber,
              color: insertBody.string,
              time: insertBody.time,
            }
            const updated1 = await models.transactions.update({
              ball: gameNewWiningNumber,

            }, {
              where: {
                round_id: games[0].roundid
              }
            });
            console.log("final body", final_body);
            const inserted = await models.current_game.create(insertBody);
            const abcd = await models.current_game.findAll({
              // limit: 7,
              offset: 1, limit: 7,
              order: [['created_at', 'DESC']]
            });
            if (inserted) {
              //console.log(inserted);
              const socketBody = {
                //current_game: insertBody,
                current_game: insertBody,
                last7Games: abcd,
                newWiningNumber: gameNewWiningNumber,
                winnersResultData: resultantValue,
                //winnersResultDataAll:finalResultArr
              }

              console.log("socket body", JSON.stringify(socketBody, null, 3));
              pushService.pushMessage(io, socketBody);
              callback();
            } else {
              //console.log("Failed to insert");
              callback();
            }
          });



        });
    } else if (indexGreen !== 1) {
      console.log("Green");
      string = "Green";
      const insertBody = {
        roundid: round_id,
        number: randomNumber,
        color: string,
        time
      };

      models.current_game.findAll({
        limit: 7,
        order: [['created_at', 'DESC']]
      })
        .then(games => {
          console.log("current round_id", round_id);
          console.log("last game id Green", games[0].roundid);
          models.useradmin_tfr.findAll({
            // attributes: ['string'],
            where: {
              round_id: games[0].roundid
            }
          }).then(async rows => {
            const add_result = [];
            console.log("last game Data Green", JSON.stringify(rows, null, 3));
            const new_array = [];
            const out1to12Array = [];
            const out13to24Array = [];
            const out25to36Array = [];
            const out1to18Array = [];
            const out19to36Array = [];
            const outEvenArray = [];
            const outOddarray = [];
            const outredArray = [];
            const outBlackArray = [];
            const out2to1_1Array = [];
            const out2to1_2Array = [];
            const out2to1_3Array = [];
            const payoutArray = [];
            const userIdArray = [];
            const selectedValuesArray = [];
            console.log("Rows", JSON.stringify(rows));
            rows.forEach(row => {
              // add_result.push(JSON.parse(row.string));
              //console.log("row data",JSON.parse(row.string));
              // new_array.push(JSON.parse(row.string));
              console.log("Row", JSON.stringify(row));
              userIdArray.push(row.user_id);

              const data = JSON.parse(row.string);
              const newNumbersArray = data.numbers;
              const convertedArray = [];
              const filteredNumber = [];
              newNumbersArray.forEach((num, index) => {
                convertedArray.push(Number(num));
                if (num !== '0') {
                  const newData = { index, number: Number(num) }
                  filteredNumber.push(newData)
                }
              });



              console.log("string array", JSON.stringify(data));
              // newNumbersArray.forEach((number, index) => {
              //   console.log("numbers array",number, index);
              //

              new_array.push(convertedArray);
              out1to12Array.push(Number(data.out1to12));
              if (data.out1to12 !== '0') {
                const out1to12 = Number(data.out1to12);
                const newData = {
                  index: 'out1to12',
                  number: out1to12
                };
                filteredNumber.push(newData);
              }
              out13to24Array.push(Number(data.out13to24));
              if (data.out13to24 !== '0') {
                const out13to24 = Number(data.out13to24);
                const newData = {
                  index: 'out13to24',
                  number: out13to24
                };
                filteredNumber.push(newData);
              }
              out25to36Array.push(Number(data.out25to36));
              if (data.out25to36 !== '0') {
                const out25to36 = Number(data.out25to36);
                const newData = {
                  index: 'out25to36',
                  number: out25to36
                };
                filteredNumber.push(newData);
              }
              out1to18Array.push(Number(data.out1to18));
              if (data.out1to18 !== '0') {
                const out1to18 = Number(data.out1to18);
                const newData = {
                  index: 'out1to18',
                  number: out1to18
                };
                filteredNumber.push(newData);
              }

              out19to36Array.push(Number(data.out19to36));

              if (data.out19to36 !== '0') {
                const out19to36 = Number(data.out19to36);
                const newData = {
                  index: 'out19to36',
                  number: out19to36
                };
                filteredNumber.push(newData);
              }
              outEvenArray.push(Number(data.outEven));
              if (data.outEven !== '0') {
                const outEven = Number(data.outEven);
                const newData = {
                  index: 'outEven',
                  number: outEven
                };
                filteredNumber.push(newData);
              }
              outOddarray.push(Number(data.outOdd));

              if (data.outOdd !== '0') {
                const outOdd = Number(data.outOdd);
                const newData = {
                  index: 'outOdd',
                  number: outOdd
                };
                filteredNumber.push(newData);
              }

              outredArray.push(Number(data.outRed));
              if (data.outRed !== '0') {
                const outRed = Number(data.outRed);
                const newData = {
                  index: 'outRed',
                  number: outRed
                };
                filteredNumber.push(newData);
              }
              outBlackArray.push(Number(data.outBlack));
              if (data.outBlack !== '0') {
                const outBlack = Number(data.outBlack);
                const newData = {
                  index: 'outBlack',
                  number: outBlack
                };
                filteredNumber.push(newData);
              }
              out2to1_1Array.push(Number(data.out2to1_1));
              if (data.out2to1_1 !== '0') {
                const out2to1_1 = Number(data.out2to1_1);
                const newData = {
                  index: 'out2to1_1',
                  number: out2to1_1
                };
                filteredNumber.push(newData);
              }
              out2to1_2Array.push(Number(data.out2to1_2));
              if (data.out2to1_2 !== '0') {
                const out2to1_2 = Number(data.out2to1_2);
                const newData = {
                  index: 'out2to1_2',
                  number: out2to1_2
                };
                filteredNumber.push(newData);
              }

              out2to1_3Array.push(Number(data.out2to1_3));
              if (data.out2to1_3 !== '0') {
                const out2to1_3 = Number(data.out2to1_3);
                const newData = {
                  index: 'out2to1_3',
                  number: out2to1_3
                };
                filteredNumber.push(newData);
              }
              payoutArray.push(Number(data.payOut));
              selectedValuesArray.push(filteredNumber);
            })
            console.log("selectd Values Array", selectedValuesArray);
            console.log(`${userIdArray}: userids, ${userIdArray.length} : length`)
            console.log(`${new_array}: Final array,  ${new_array.length}: length`);

            const resulArrayNew = _.unzipWith(new_array, _.add);
            console.log("Result New array", resulArrayNew);

            const sum_out1to12 = _.reduce(out1to12Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out13to24 = _.reduce(out13to24Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out25to36 = _.reduce(out25to36Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out1to18 = _.reduce(out1to18Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out19to36 = _.reduce(out19to36Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_outEven = _.reduce(outEvenArray, function (acc, cur) {
              return acc + cur;
            });

            const sum_outOdd = _.reduce(outOddarray, function (acc, cur) {
              return acc + cur;
            });

            const sum_outred = _.reduce(outredArray, function (acc, cur) {
              return acc + cur;
            });

            const sum_outBlack = _.reduce(outBlackArray, function (acc, cur) {
              return acc + cur;
            });

            const sum_out2to1_1 = _.reduce(out2to1_1Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out2to1_2 = _.reduce(out2to1_2Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_out2to1_3 = _.reduce(out2to1_3Array, function (acc, cur) {
              return acc + cur;
            });

            const sum_payout = _.reduce(payoutArray, function (acc, cur) {
              return acc + cur;
            });

            const multipliedArray = resulArrayNew.map(function (num) {
              return num * 35;
            })

            finalSelected = [];
            selectedValuesArray.forEach((selectValue, index) => {
              userId = userIdArray[index]
              console.log("user id", userId);
              const finalSel = {
                userId,
                selectValue
              };

              finalSelected.push(finalSel);
            })
            console.log(`${JSON.stringify(finalSelected, null, 3)} : finalSelected`);
            const bettingArray = {
              numbers: multipliedArray,
              out1to12: sum_out1to12 * 3,
              out13to24: sum_out13to24 * 3,
              out25to36: sum_out25to36 * 3,
              out1to18: sum_out1to18 * 2,
              out19to36: sum_out19to36 * 2,
              outEven: sum_outEven * 2,
              outOdd: sum_outOdd * 2,
              outRed: sum_outred * 2,
              outBlack: sum_outBlack * 2,
              out2to1_1: sum_out2to1_1 * 3,
              out2to1_2: sum_out2to1_2 * 3,
              out2to1_3: sum_out2to1_3 * 3,
              payOut: sum_payout
            }
            console.log("betting Array", bettingArray);

            let minimum_amount = _.min(multipliedArray);
            let minimum_amountNew = _.min(multipliedArray);
            let minimum_mnt_index = _.indexOf(multipliedArray, _.min(multipliedArray));
            console.log("minimum amount", minimum_amount);

            let minimum_amounts_array = [];
            multipliedArray.forEach(function (num, index) {
              console.log("num into foreach", num);
              if (num <= minimum_amountNew) {
                console.log("condition true for", minimum_amount);
                if (_.includes(out1to12Numbers, index)) {
                  minimum_amount += sum_out1to12 * 3;
                }
                if (_.includes(out13to24Numbers, index)) {
                  minimum_amount += sum_out13to24 * 3;
                }
                if (_.includes(out25to36Numbers, index)) {
                  minimum_amount += sum_out25to36 * 3;
                }
                if (_.includes(out1to18Numbers, index)) {
                  minimum_amount += sum_out1to18 * 2;
                }
                if (_.includes(out19to36Numbers, index)) {
                  minimum_amount += sum_out19to36 * 2;
                }
                if (_.includes(outEvenNumbers, index)) {
                  minimum_amount += sum_outEven * 2;
                }
                if (_.includes(outOddNumbers, index)) {
                  minimum_amount += sum_outOdd * 2;
                }
                if (_.includes(outRedNumbers, index)) {
                  minimum_amount += sum_outred * 2;
                }
                if (_.includes(outBlackNumbers, index)) {
                  minimum_amount += sum_outBlack * 2;
                }
                if (_.includes(out2to1_1Numbers, index)) {
                  minimum_amount += sum_out2to1_1 * 3;
                }
                if (_.includes(out2to1_2Numbers, index)) {
                  minimum_amount += sum_out2to1_2 * 3;
                }
                if (_.includes(out2to1_3Numbers, index)) {
                  minimum_amount += sum_out2to1_3 * 3;
                }

                const winingamtListArray = {
                  index: index,
                  amount: minimum_amount
                }
                minimum_amounts_array.push(winingamtListArray);
                minimum_amount = minimum_amountNew;
              }
            })


            console.log("wining Amount", minimum_amounts_array);

            var min_value = _.minBy(minimum_amounts_array, 'amount');
            console.log("wining min value", min_value);
            console.log("type of min value array", typeof (min_value));
            let resultantValue = [];
            let gameRoundId = '';
            let gameOldNumber = '';
            let gameNewWiningNumber = '';
            if (min_value) {

              if (games[0].number != min_value.index || sum_payout >= min_value.amount) {
                let num_color = '';
                // pathakrahul2704 work => check for admin number punch if least payout is set
                min_value.index = games[0].custom_number ? games[0].custom_number : min_value.index;
                const chk_red = roulleteRed.indexOf(min_value.index);
                const chk_black = roulleteBlack.indexOf(min_value.index);
                const chk_green = roulleteGreen.indexOf(min_value.index);
                if (chk_red !== -1) {
                  console.log("check color red", chk_red);
                  num_color = 'Red';
                }
                else if (chk_black !== -1) {
                  console.log("check color Black", chk_black);
                  num_color = 'Black';
                }
                else if (chk_green !== -1) {
                  console.log("check color Green", chk_green);
                  num_color = 'Green';
                }
                else {
                  console.log("check color else", chk_green);
                  num_color = 'Green';
                }
                const updated = await models.current_game.update({
                  number: min_value.index,
                  color: num_color
                }, {
                  where: {
                    roundid: games[0].roundid
                  }
                });



                let finalUsersArray = [];
                finalSelected.forEach(selectvals => {
                  const { userId, selectValue } = selectvals;
                  console.log("final selected array into foreach ", JSON.stringify(selectValue, null, 3));
                  const sel_newArry = [];
                  const sel_amtArry = [];
                  console.log("select value type of", typeof (selectValue));
                  selectValue.forEach(num => {

                    sel_newArry.push(num.index);
                    sel_amtArry.push(num.number);
                  })


                  console.log("sel new Array", sel_newArry);
                  console.log("sel amount new Array", sel_amtArry);
                  const newIndex = _.includes(sel_newArry, min_value.index)
                  console.log(`${newIndex} : new index, ${min_value.index} : min value index`);
                  if (newIndex) {
                    const newAmountIndex = sel_newArry.indexOf(min_value.index);
                    const betAmountuser = selectValue[newAmountIndex].number;
                    console.log("new Indexes", selectValue[newAmountIndex].number);
                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex,
                      be_amt_user: betAmountuser * 35
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);
                    //finalUsersArray
                  }
                  // else {
                  console.log("into else of sel new array with", sel_newArry);
                  if (_.includes(sel_newArry, 'out1to12') && _.includes(out1to12Numbers, min_value.index)) {

                    const newAmountIndex_new_old = 'out1to12';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);

                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }
                  if (_.includes(sel_newArry, 'out13to24') && _.includes(out13to24Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out13to24';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out25to36') && _.includes(out25to36Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out25to36';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out1to18') && _.includes(out1to18Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out1to18';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out19to36') && _.includes(out19to36Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out19to36';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outEven') && _.includes(outEvenNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outEven';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outOdd') && _.includes(outOddNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outOdd';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outRed') && _.includes(outRedNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outRed';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'outBlack') && _.includes(outBlackNumbers, min_value.index)) {
                    const newAmountIndex_new_old = 'outBlack';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 2
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }
                  if (_.includes(sel_newArry, 'out2to1_1') && _.includes(out2to1_1Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_1';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }
                  if (_.includes(sel_newArry, 'out2to1_2') && _.includes(out2to1_2Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_2';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);

                  }

                  if (_.includes(sel_newArry, 'out2to1_3') && _.includes(out2to1_3Numbers, min_value.index)) {
                    const newAmountIndex_new_old = 'out2to1_3';
                    const newAmountIndex_new = sel_newArry.indexOf(newAmountIndex_new_old);
                    const newAmount_data = sel_amtArry[newAmountIndex_new];
                    console.log("new Amount Index_new", newAmountIndex_new);
                    console.log("new Amount data ", newAmount_data);


                    const finaldata = {
                      userId,
                      amount_index: newAmountIndex_new,
                      be_amt_user: newAmount_data * 3
                    }
                    //finalUser
                    finalUsersArray.push(finaldata);


                  }

                  //}


                  // const {user, numbers} = selectvals;
                  // numbers.forEach(number=>{
                  //
                  // })
                })
                console.log('final Users Array', finalUsersArray);
                var result = finalUsersArray.reduce(function (r, o) {
                  var k = o.userId;   // unique `loc` key
                  if (r[k] || (r[k] = [])) r[k].push(o.be_amt_user);
                  return r;
                }, {});



                const lastDatawithuser = toNumericPairs(result);
                lastDatawithuser.forEach((val, index) => {
                  var userid = val[0];
                  var nums = val[1];
                  var final_amt = _.sum(nums);

                  const finalCalculation = {
                    userId: userid,
                    total_amt: final_amt
                  }
                  console.log("Final Calculation", finalCalculation);
                  //finalUser
                  models.users.findOne({
                    where: {
                      id: userid
                    }
                  }).then(async user => {
                    console.log("Update Balance of Users 3");
                    const newBalance = Number(user.balance) + Number(final_amt);
                    const updated = await models.users.update({
                      balance: newBalance,
                    }, {
                      where: {
                        id: userId
                      }
                    });
                    const updated1 = await models.transactions.update({
                      earned: final_amt,
                    }, {
                      where: {
                        user_id: userId,
                        round_id: games[0].roundid
                      }
                    });
                    if (updated) {
                      resultantValue.push(finalCalculation);
                    }
                  })
                })
                console.log("final user array", result);
                console.log("to numeric pairs", toNumericPairs(result));
                console.log("final resultant array", resultantValue);




              }

              console.log("updated round ID", games[0].roundid);
              console.log("games old number", games[0].number);
              console.log("games new number with min amount", min_value.index);
              console.log("games winning number amount", min_value.amount);

            }
            gameRoundId = games[0].roundid;
            gameOldNumber = games[0].number;
            if (min_value) {
              if (games[0].number != min_value.index || sum_payout >= min_value.amount) {
                gameNewWiningNumber = min_value.index;
              }
              else {
                gameNewWiningNumber = games[0].number;
              }

            }
            else {
              console.log("Generating Random 3");
              gameNewWiningNumber = games[0].number;
            }
            console.log("game Old Wining Number", games[0].number);
            console.log("game New Wining Number", gameNewWiningNumber);
            console.log("resultant Value with user id and amount", resultantValue);

            console.log("resultant Value with user id and amount", resultantValue);

            //const finalResultArr = [];
            // resultantValue.forEach(resultant =>{
            //   const {userId,total_amt}=resultant;
            //   models.users.findOne({
            //     where:{
            //       id:userId
            //     }
            //   }).then(async userdata => {
            //       const newBalance=Number(userdata.balance)+Number(total_amt);
            //     const updated = await models.users.update({
            //               balance: newBalance,
            //             }, {
            //               where: {
            //                 id:userId
            //               }
            //             });
            //       console.log("updated value",updated);
            //     if (updated) {
            //       console.log("into updated value of newBalance");
            //       const nod =  {
            //         userId,
            //         newBalance: newBalance
            //       }
            //       finalResultArr.push(nod);
            //       console.log("into updated value final Result Arr ",finalResultArr);
            //     } else {
            //       const nod =  {
            //         userId,
            //         newBalance: total_amt
            //       }
            //       finalResultArr.push(nod);
            //     }
            //   }).catch(err => {
            //     finalResultArr.push(resultant);
            //   })
            // })
            //console.log("const final Result Arr",finalResultArr);

            // fs.writeFile('toarry.txt',new_array[0]);
            // console.log("added Result array Green",add_result);
            const final_body = {
              roundid: gameRoundId,
              number: gameNewWiningNumber,
              color: insertBody.string,
              time: insertBody.time,
            }
            const updated1 = await models.transactions.update({
              ball: gameNewWiningNumber,

            }, {
              where: {
                round_id: games[0].roundid
              }
            });
            console.log("final body", final_body);
            const inserted = await models.current_game.create(insertBody);

            if (inserted) {
              console.log(inserted);
              const abcd = await models.current_game.findAll({
                // limit: 7,
                offset: 1, limit: 7,
                order: [['created_at', 'DESC']]
              });
              const socketBody = {
                //current_game: insertBody,
                current_game: insertBody,
                last7Games: abcd,
                newWiningNumber: gameNewWiningNumber,
                winnersResultData: resultantValue,
                //winnersResultDataAll:finalResultArr
              }

              console.log("socket body", JSON.stringify(socketBody, null, 3));
              pushService.pushMessage(io, socketBody);
              callback();
            } else {
              console.log("Failed to insert");
              callback();
            }
          });

        }).catch(error => {
          callback();
        })
    }
  }

  function wait75Second() {
    setTimeout(() => {
      doJob(wait75Second);
    }, 75000);
  };

  doJob(wait75Second);
}


/* let job = schedule.scheduleJob(rule, () => {
	console.log("Job scheduled");
    });*/

// module.exports = job;
