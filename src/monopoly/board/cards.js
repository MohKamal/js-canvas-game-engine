class Cards {
    constructor(game) {
        this.player = null;
        this.cadrs = [];
        this.game = game;
        this.getCards();
    }

    setPlayer(player) {
        this.player = player;
    }

    getCards() {
        this.cadrs = [];
        let c1 = new Card('You pay $100 for travalling', 'chance', this.game);
        c1.action = function() {
            if (this.player.solde >= 100) {
                this.player.solde -= 100;
                return true;
            } else {
                console.log('does he need money');
                this.game.needMoney({ action: 'pay', value: 100, required: true });
                return false;
            }
        }.bind(c1);
        c1.setPlayer(this.player);

        this.cadrs.push(c1);

        return this.cadrs;
    }
}