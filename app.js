'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({'input': rs, 'output': {} });
const prefectureDateMap = new Map();  //key:都道府県 value:集計データのオブジェクト

// 一行読んだら以下の処理を実行する
rl.on('line', (lineString) => {
  // ファイルから必要なデータを抜き出す
  const columns = lineString.split(',');
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);
  if(year === 2010 || year === 2015){
    let value = prefectureDateMap.get(prefecture);
    if(!value){
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if(year === 2010){
      value.popu10 = popu;
    }
    if(year === 2015){
      value.popu15 = popu;
    }
    prefectureDateMap.set(prefecture, value);
    // prefectureDateMap.set('北海道', { popu10: 270000, popu15: 277777, change: null } );の形を作っている
  }
});

// 全ての行を読み込み終わったら以下の処理を実行する
rl.on('close', () => {
  // 変化率を計算
  for(let [key, value] of prefectureDateMap){
    value.change = value.popu15 / value.popu10;
  }
  // 変化率の大きい順に並び替え
  // 連想配列は並び替えの関数を持っていないので、配列に変換して並び替える
  const rankingArray = Array.from(prefectureDateMap).sort((pair1, pair2) => {
    return pair2[1].change - pair1[1].change;
  });
  //整形して出力
  const rankingStrings = rankingArray.map(([key, value]) => {
    return `${key}: ${value.popu10} -> ${value.popu15} 変化率:${value.change}`
  });
  console.log(rankingStrings);
});
