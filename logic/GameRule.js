//游戏规则

var GameRule = function() {

};

/**
 * 牌型判断
 * @method function
 * @param  {[type]} cards [description]
 * @return {[type]}       [description]
 */
GameRule.prototype.typeJudge = function(cards){
    var self = this,
        len = cards.length;
    switch (len) {
        case 1:
            return {'cardKind': self.ONE, 'val': cards[0].val, 'size': len};
        case 2:
            if(self.isPairs(cards))
                return {'cardKind': self.PAIRS, 'val': cards[0].val, 'size': len};
            else if (self.isKingBomb(cards))
                return {'cardKind': self.KING_BOMB, 'val': cards[0].val, 'size': len};
            else
                return null;
        case 3:
            if(self.isThree(cards))
                return {'cardKind': self.THREE, 'val': cards[0].val, 'size': len};
            else
                return null;
        case 4:
            if(self.isThreeWithOne(cards)){
                return {'cardKind': self.THREE_WITH_ONE, 'val': self.getMaxVal(cards, 3), 'size': len};
            } else if (self.isBomb(cards)) {
                return {'cardKind': self.BOMB, 'val': cards[0].val, 'size': len};
            }
            return null;
        default:
            if(self.isProgression(cards))
                return {'cardKind': self.PROGRESSION, 'val': cards[0].val, 'size': len};
            else if(self.isProgressionPairs(cards))
                return {'cardKind': self.PROGRESSION_PAIRS, 'val': cards[0].val, 'size': len};
            else if(self.isThreeWithPairs(cards))
                return {'cardKind': self.THREE_WITH_PAIRS, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlane(cards))
                return {'cardKind': self.PLANE, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlaneWithOne(cards))
                return {'cardKind': self.PLANE_WITH_ONE, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isPlaneWithPairs(cards))
                return {'cardKind': self.PLANE_WITH_PAIRS, 'val': self.getMaxVal(cards, 3), 'size': len};
            else if(self.isFourWithTwo(cards))
                return {'cardKind': self.FOUR_WITH_TWO, 'val': self.getMaxVal(cards, 4), 'size': len};
            else if(self.isFourWithPairs(cards))
                return {'cardKind': self.FOUR_WITH_TWO_PAIRS, 'val': self.getMaxVal(cards, 4), 'size': len};
            else
                return null;
    }
};
//是否是对子
GameRule.prototype.isPairs = function(cards) {
    console.log('in isPairs')
    return cards.length == 2 && cards[0].val === cards[1].val;
};
//是否是三根
GameRule.prototype.isThree = function(cards) {
    console.log('in isThree')
    return cards.length == 3 && cards[0].val === cards[1].val && cards[1].val === cards[2].val;
};
//是否是三带一
GameRule.prototype.isThreeWithOne = function(cards) {
    console.log('in isThreeWithOne')
    if(cards.length != 4) return false;
    var c = this.valCount(cards);
    return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
};
//是否是三带一对
GameRule.prototype.isThreeWithPairs = function(cards) {
    console.log('in isThreeWithPairs')
    if(cards.length != 5) return false;
    var c = this.valCount(cards);
    return c.length === 2 && (c[0].count === 3 || c[1].count === 3);
};
//是否是顺子
GameRule.prototype.isProgression = function(cards) {
    console.log('in isProgression')
    if(cards.length < 5 || cards[0].val === 15) return false;
    for (var i = 0; i < cards.length; i++) {
        if(i != (cards.length - 1) && (cards[i].val - 1) != cards[i + 1].val){
            return false;
        }
    }
    return true;
};
//是否是连对
GameRule.prototype.isProgressionPairs = function(cards) {
    console.log('in isProgressionPairs')
    if(cards.length < 6 || cards.length % 2 != 0 || cards[0].val === 15) return false;
    for (var i = 0; i < cards.length; i += 2) {
        if(i != (cards.length - 2) && (cards[i].val != cards[i + 1].val || (cards[i].val - 1) != cards[i + 2].val)){
            return false;
        }
    }
    return true;
};
//是否是飞机
GameRule.prototype.isPlane = function(cards) {
    console.log('in isPlane')
    if(cards.length < 6 || cards.length % 3 != 0 || cards[0].val === 15) return false;
    for (var i = 0; i < cards.length; i += 3) {
        if(i != (cards.length - 3) && (cards[i].val != cards[i + 1].val || cards[i].val != cards[i + 2].val || (cards[i].val - 1) != cards[i + 3].val)){
            return false;
        }
    }
    return true;
};
//是否是飞机带单
GameRule.prototype.isPlaneWithOne = function(cards) {
    console.log('in isPlaneWithOne')
    if(cards.length < 8 || cards.length % 4 != 0) return false;
    var c = this.valCount(cards),
        threeList = [],
        threeCount = cards.length / 4;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count == 3){
            threeList.push(c[i]);
        }
    }
    if(threeList.length != threeCount || threeList[0].val === 15){//检测三根数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val){
            return false;
        }
    }
    return true;
};
//是否是飞机带对
GameRule.prototype.isPlaneWithPairs = function(cards) {
    console.log('in isPlaneWithPairs')
    if(cards.length < 10 || cards.length % 5 != 0) return false;
    var c = this.valCount(cards),
        threeList = [],
        pairsList = [],
        groupCount = cards.length / 5;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count == 3){
            threeList.push(c[i]);
        }
        else if(c[i].count == 2){
            pairsList.push(c[i]);
        } else {
            return false;
        }
    }
    if(threeList.length != groupCount || pairsList.length != groupCount || threeList[0].val === 15){//检测三根数量和对子数量和不能为2
        return false;
    }
    for (i = 0; i < threeList.length; i++) {//检测三根是否连续
        if(i != threeList.length - 1 && threeList[i].val - 1 != threeList[i + 1].val){
            return false;
        }
    }
    return true;
};
//是否是四带二
GameRule.prototype.isFourWithTwo = function(cards) {
    console.log('in isFourWithTwo')
    var c = this.valCount(cards);
    if(cards.length != 6 || c.length > 3) return false;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count === 4)
            return true;
    }
    return false;
};
//是否是四带两个对
GameRule.prototype.isFourWithPairs = function(cards) {
    console.log('in isFourWithPairs')
    if(cards.length != 8) return false;
    var c = this.valCount(cards);
    if(c.length != 3) return false;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count != 4 && c[i].count != 2)
            return false;
    }
    return true;
};
//是否是炸弹
GameRule.prototype.isBomb = function(cards) {
    return cards.length === 4 && cards[0].val === cards[1].val && cards[0].val === cards[2].val && cards[0].val === cards[3].val;
};
//是否是王炸
GameRule.prototype.isKingBomb = function(cards) {
    return cards.length === 2 && cards[0].type == '0' && cards[1].type == '0';
};
/**
 * 获取min到max之间的随机整数，min和max值都取得到
 * @param  {number} min - 最小值
 * @param  {number} max - 最大值
 * @return {number}
 */
GameRule.prototype.random = function(min, max) {
	min = min == null ? 0 : min;
	max = max == null ? 1 : max;
	var delta = (max - min) + 1;
	return Math.floor(Math.random() * delta + min);
};

/**
 * 牌统计，统计各个牌有多少张，比如2张A，一张8
 * @param  {list} cards - 要统计的牌
 * @return {object array} val：值，count：数量
 */
GameRule.prototype.valCount = function(cards){
    var result = [];
    var addCount = function(result , v){
        for (var i = 0; i < result.length; i++) {
            if(result[i].val == v){
                result[i].count ++;
                return;
            }
        }
        result.push({'val': v, 'count': 1});
    };
    for (var i = 0; i < cards.length; i++){
        addCount(result, cards[i].val);
    }
    return result;
};
/**
 * 获取指定张数的最大牌值
 * @param  {list} cards - 牌
 * @param  {list} cards - 张数
 * @return 值
 */
GameRule.prototype.getMaxVal = function(cards, n){
    var c = this.valCount(cards);
    var max = 0;
    for (var i = 0; i < c.length; i++) {
        if(c[i].count === n && c[i].val > max){
            max = c[i].val;
        }
    }
    return max;
};


/**
 * 卡牌排序
 * @method cardSort
 * @param  {Object} a [description]
 * @param  {Object} b [description]
 * @return 1 : a < b ,-1 a : > b   [description]
 */
GameRule.prototype.cardSort = function (a, b){
    var va = parseInt(a.val);
    var vb = parseInt(b.val);
    if(va === vb){
        return a.type > b.type ? 1 : -1;
    } else if(va > vb){
        return -1;
    } else {
        return 1;
    }
};
/**
 * 牌型枚举
 */
GameRule.prototype.ONE = 1;
GameRule.prototype.PAIRS = 2;
GameRule.prototype.THREE = 3;
GameRule.prototype.THREE_WITH_ONE = 4;
GameRule.prototype.THREE_WITH_PAIRS = 5;
GameRule.prototype.PROGRESSION = 6;
GameRule.prototype.PROGRESSION_PAIRS = 7;
GameRule.prototype.PLANE = 8;
GameRule.prototype.PLANE_WITH_ONE = 9;
GameRule.prototype.PLANE_WITH_PAIRS = 10;
GameRule.prototype.FOUR_WITH_TWO = 11;
GameRule.prototype.FOUR_WITH_TWO_PAIRS = 12;
GameRule.prototype.BOMB = 13;
GameRule.prototype.KING_BOMB = 14;
/**
 * 错误提示
 */
GameRule.prototype.MSG_NO_SELECT = '请选择要出的牌';
GameRule.prototype.MSG_ERROR_TYPE = '您选择的牌不符合游戏规则';
GameRule.prototype.MSG_NO_ROROB_RESTART = '所有玩家均未叫分，重新发牌';

//桌位状态
GameRule.prototype.DESK_STATUS_READY = 1;
GameRule.prototype.DESK_STATUS_ROB = 2;
GameRule.prototype.DESK_STATUS_PLAY = 3;

module.exports = GameRule;