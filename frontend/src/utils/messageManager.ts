// frontend/src/utils/messageManager.ts

export const DURATION_CHECKPOINTS = [
    17, 60, 90, 107, 156, 169, 222, 295, 327, 360, 420, 480, 730, 1120, 1440, 2400, 3080, 39343, 525600
  ];

export const getMessageForDuration = (duration: number): string => {
    if (duration >= 525600) {
      return "一年365日（525600分）";
    } else if (duration >= 39343) {
      return "月が地球を一周する時間（39343分）";
    } else if (duration >= 3080) {
      return "アメリア横断鉄道カリフォルニアゼファーのシカゴからサンフランシスコまでの所要時間（3080分）";
    } else if (duration >= 2400) {
      return "トーマス・エジソンが初めて実用的な白熱電球を点灯させ続けた時間（2400分）";
    } else if (duration >= 1440) {
      return "一日24時間（1440分）";
    } else if (duration >= 1120) {
      return "シンガポール航空が運行するニューヨーク発シンガポール行きのフライト時間（1120分）";
    } else if (duration >= 730) {
      return "「未来少年コナン」アニメ全26話の合計放映時間（730分）";
    } else if (duration >= 480) {
      return "労働基準法に定められた１日の労働時間制限（480分）";
    } else if (duration >= 420) {
      return "東京からハワイへのフライト時間（420分）";
    } else if (duration >= 360) {
      return "富士山吉田ルートの標準登山時間（360分）";
    } else if (duration >= 327) {
      return "新幹線ひかりの東京から広島までの乗車時間（327分）";
    } else if (duration >= 295) {
      return "1933年明石中vs中京商の甲子園最長の試合時間（295分）";
    } else if (duration >= 222) {
      return "「風と共に去りぬ」の上映時間（222分）";
    } else if (duration >= 169) {
      return "「インターステラー」の上映時間（169分）";
    } else if (duration >= 156) {
      return "深海探査艇ディープシーチャレンジャー号がチャレンジャー海淵の潜航を開始し海底に到達するまでの時間（156分）";
    } else if (duration >= 107) {
      return "「Lock, Stock and Two Smoking Barrels」の上映時間（107分）";
    } else if (duration >= 90) {
      return "国際宇宙ステーションが地球を一周する時間（90分）";
    } else if (duration >= 60) {
      return "山手線全30駅を一周する時間（60分）";
    } else if (duration >= 17) {
      return "キング牧師のI Have a Dreamスピーチ（17分）";
    } else {
      return "回数を重ねるとメッセージが表示されます";
    }
  };
  

  export const COUNT_CHECKPOINTS = [
    4, 12, 17, 18, 25, 33, 50, 54, 71, 80, 89, 99, 108, 135, 161, 163, 173, 411, 459, 476, 600, 714, 868, 2523
  ];
  
  export const getMessageForCount = (count: number): string => {
    if (count >= 2523) {
      return "東京スカイツリーの非常階段の段数（2523段）";
    } else if (count >= 868) {
      return "王貞治の生涯累計ホームラン数（868本）";
    } else if (count >= 714) {
      return "ベーブルースの生涯累計ホームラン数（714本）";
    } else if (count >= 600) {
      return "東京タワーの外階段の段数（600段）";
    } else if (count >= 476) {
      return "神戸ポートタワーの外階段の段数（476段）";
    } else if (count >= 459) {
      return "日本の国道の路線数（459路線）";
    } else if (count >= 411) {
      return "1950年山部俊郎vs星野紀の囲碁公式戦最長手数数（411手）";
    } else if (count >= 173) {
      return "イギリスの有人島の数（173島）";
    } else if (count >= 163) {
      return "ドバイの超高層ビルブルジュハリファの階数（163階）";
    } else if (count >= 161) {
      return "JR山陰本線の停車駅数（161駅）";
    } else if (count >= 135) {
      return "スペースシャトルの総打ち上げ回数（135回）";
    } else if (count >= 108) {
      return "除夜の鐘をつく回数（108回）";
    } else if (count >= 99) {
      return "羽生善治のタイトル獲得回数（99回）";
    } else if (count >= 89) {
      return "羽生善治の2000年度の年度対局数（89局）";
    } else if (count >= 80) {
      return "ハチドリが1秒間に羽ばたく回数（80回）";
    } else if (count >= 71) {
      return "軍艦島で建てられた建物の数（71棟）";
    } else if (count >= 54) {
      return "アフリカ大陸の国の数（54か国）";
    } else if (count >= 50) {
      return "アメリカ合衆国の州の数（50州）";
    } else if (count >= 33) {
      return "メリル・ストリープのゴールデングローブ賞ノミネート回数（33回）";
    } else if (count >= 25) {
      return "バレーボールで1ゲーム獲得に必要な点数（25点）";
    } else if (count >= 18) {
      return "サクラダファミリアの塔の数（18本）";
    } else if (count >= 17) {
      return "新幹線こだまの停車駅数（17駅）";
    } else if (count >= 12) {
      return "一般的なアニメの1クールの放送話数（12回）";
    } else if (count >= 4) {
      return "テニスで1ゲーム獲得に必要な点数（4回）";
    } else {
      return "回数を重ねるとメッセージが表示されます";
    }
  };
  