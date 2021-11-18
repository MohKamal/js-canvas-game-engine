class Map {

    constructor(size, engine) {
        this.size = size;
        this.tiles = [];
        this.moving = false;
        this.engine = engine;
        this.players = [];
        this.currentPlayer = null;
        this.currentPlayerIndex = -1;
        this.dices = [];
        this.totalSteps = 0;
        this.isDicesThrowing = false;
        this.canThrow = true;
        this.canEnd = false;
        this.doubleCount = 0;

        this.chanceCardsSprites = new Sprite(256, 128);
        this.chanceCardsSprites.loadImage('./assets/sprites/board/chance_cards.png');

        this.chestCardsSprites = new Sprite(256, 128);
        this.chestCardsSprites.loadImage('./assets/sprites/board/community_chest_cards.png');

        this.sirenAnimation = new SpriteSheet('siren', 800, 150, 20, 0, 2, './assets/sprites/siren.png', false);
        this.canPlaySirenAnimation = false;

        this.messageBox = new MessageBox(this.engine, this);

        this.bottomBar = new BottomBar(this.engine, this.messageBox, this);

        this.cards = new Cards(this);
        this.sidePlayers = new PlayerSideBar(this.engine, this);

        this.lastStep = 0.5;
        this.timeBetweenSteps = 0.1;

        this.throwButtonSprite = new Sprite(200, 50);
        this.throwButtonSprite.loadImage('./assets/sprites/buttons/throw_off.png');
        this.throwButton = new GameObject(this.throwButtonSprite, new Position((this.engine.screenSize().width / 2) - 80, 180));

        this.endButtonSprite = new Sprite(200, 50);
        this.endButtonSprite.loadImage('./assets/sprites/buttons/end_turn_off.png');
        this.endTurnButton = new GameObject(this.endButtonSprite, new Position((this.engine.screenSize().width / 2) - 80, 280));

        this.lockNeedMoney = false;
        this.shortOnMoney = false;
        this.afterGotMoneyObject = { action: 'rent', value: 50 };

        this.clickSound = new Sound('./assets/audio/click.mp3', 80);
        this.dicesSound = new Sound('./assets/audio/dices.mp3', 80);
        this.notifSound = new Sound('./assets/audio/notif.wav', 80);
        this.payedSound = new Sound('./assets/audio/payed.wav', 80);
        this.jailSound = new Sound('./assets/audio/jail.mp3', 30);
        this.failedSound = new Sound('./assets/audio/failed.mp3', 10);
        this.backgroundMusic = new Sound('./assets/audio/background.mp3', 6, true);
    }

    OnCreate() {
        this.initTilesToBoard();
        let jeep = new Piece('./assets/sprites/simple_jeep.png', new Position(0, 0));
        jeep.cartesianPosition = new Position(10, 0);
        jeep.position = this.isometricPosition(jeep.cartesianPosition, new Size(128, 64), new Point(
            this.middlePosition().start.X,
            this.middlePosition().start.Y,
        ));
        let car = new Piece('./assets/sprites/simple_car.png', new Position(0, 0));
        car.cartesianPosition = new Position(10, 0);
        car.position = this.isometricPosition(car.cartesianPosition, new Size(128, 64), new Point(
            this.middlePosition().start.X,
            this.middlePosition().start.Y,
        ));

        let player1 = new Player('Player 1');
        player1.piece = jeep;
        jeep.owner = player1;
        this.players.push(player1);

        let player2 = new Player('Player 2');
        player2.piece = car;
        car.owner = player2;
        this.players.push(player2);
        if (this.engine.playMusic)
            this.backgroundMusic.play();
        this.initDices();
        this.giveTurn();

    }

    initDices() {
        let dice1 = new Dice(new Position(7, 4), 'dice 1');
        let dice2 = new Dice(new Position(7, 5), 'dice 2');
        this.dices.push(dice1);
        this.dices.push(dice2);
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    throwDices() {
        this.totalSteps = 0;
        if (this.dices[0].isStoped && this.dices[0].selectedNumber > 0 &&
            this.dices[1].isStoped && this.dices[1].selectedNumber > 0 &&
            this.isDicesThrowing) {
            this.isDicesThrowing = false;
            let double = this.dices[0].selectedNumber == this.dices[1].selectedNumber;

            this.totalSteps = this.dices[0].selectedNumber + this.dices[1].selectedNumber;
            this.dices[0].selectedNumber = -1;
            this.dices[1].selectedNumber = -1;
            this.canThrow = false;
            if (this.currentPlayer.inJail) {
                if (double || this.currentPlayer.doubleCount >= 3) {
                    this.currentPlayer.inJail = false;
                    this.currentPlayer.doubleCount = 0;
                    this.movePiece(this.currentPlayer.piece, this.totalSteps, true, double);
                } else {
                    this.currentPlayer.doubleCount++;
                    this.canEnd = true;
                    return true;
                }
            }
            if (double) {
                if (this.doubleCount < 2) {
                    this.doubleCount++;
                } else {
                    this.messageBox.simple(`You are going to Jail, you had 3 doubles in a row.`, function() { this.messageBox.remove(); }.bind(this), 400, 200);
                    this.doubleCount = 0;
                    this.currentPlayer.inJail = true;
                    this.goToJail(this.currentPlayer.piece);
                    return true;
                }
            } else
                this.doubleCount = 0;
            this.movePiece(this.currentPlayer.piece, this.totalSteps, true, double);
            return true;
        }
        if (this.engine.sfx)
            this.dicesSound.play();
        for (var d = 0; d < 2; d++) {
            if (this.dices[d].isStoped && this.dices[d].selectedNumber < 0)
                this.dices[d].throwDice();
        }
    }

    OnUpdate(elapsedTime) {
        // this.engine.drawer.gradient(new Position(0, 0), this.engine.screenSize(), new Point(0, 0), new Point(0, this.engine.screenSize().height - 100), '#757F9A', '#D7DDE8');

        this.drawBoard();
        this.drawPieces();
        // Draw Dices
        for (var d = 0; d < 2; d++) {
            if (this.dices[d]) {
                this.dices[d].position = this.isometricPosition(this.dices[d].location, new Size(128, 64), new Point(
                    this.middlePosition().start.X,
                    this.middlePosition().start.Y,
                ));
                this.engine.drawer.gameObject(this.dices[d]);
            }
        }

        // Draw Throw button
        if (this.canThrow && !this.lockNeedMoney && !this.messageBox.isOpen) {
            if (this.engine.mouseOnTopOf(this.throwButton)) {
                this.throwButtonSprite.loadImage('./assets/sprites/buttons/throw_on.png');
                if (this.engine.mouseClicked(MouseButton.LEFT) && !this.isDicesThrowing && this.canThrow) {
                    if (this.engine.sfx)
                        this.clickSound.play();
                    this.isDicesThrowing = true;
                    this.canThrow = false;
                }

            } else
                this.throwButtonSprite.loadImage('./assets/sprites/buttons/throw_off.png');
            this.engine.drawer.gameObject(this.throwButton);
        } else if (!this.canThrow && this.canEnd && !this.lockNeedMoney && !this.messageBox.isOpen) {
            if (this.engine.mouseOnTopOf(this.endTurnButton)) {
                this.endButtonSprite.loadImage('./assets/sprites/buttons/end_turn_on.png');
                if (this.engine.mouseClicked(MouseButton.LEFT) && !this.isDicesThrowing && !this.canThrow) {
                    if (this.engine.sfx)
                        this.clickSound.play();
                    this.endTurn();
                }

            } else
                this.endButtonSprite.loadImage('./assets/sprites/buttons/end_turn_off.png');
            this.engine.drawer.gameObject(this.endTurnButton);
        }

        if (this.currentPlayer.piece.moving) {
            this.canEnd = false;
            this.currentPlayer.piece.geoAnimation.animate(elapsedTime);
        } else {
            this.canEnd = true;
        }

        if (this.isDicesThrowing) {
            this.throwDices();
        }

        if (this.lockNeedMoney) {
            this.checkForNeedingMoney();
        }

        // this.engine.drawer.text(`Steps: ${this.totalSteps}`, new Position(10, 40 + (10 * d)));

        this.drawBoardCards(); // Chance and chest board cards

        // Draw Houses
        this.drawBoardHouses();

        if (this.sidePlayers.viewedPlayer) {
            this.bottomBar.setPlayer(this.sidePlayers.viewedPlayer);

        } else {
            this.bottomBar.setPlayer(this.currentPlayer);
        }
        this.bottomBar.display(elapsedTime);
        this.sidePlayers.display(elapsedTime);
        this.playSirenAnimation();
        if (this.messageBox)
            this.messageBox.draw();
    }

    movePiece(piece, steps, salary = true, double = false) {
        piece.geoAnimation = new GeometricAnimation('moving', piece);
        piece.geoAnimation.startFrom(null);
        this.initPieceDirection(piece);
        this.calculePosition(piece, steps, salary);
        let newPosition = this.isometricPosition(piece.cartesianPosition, new Size(128, 64), new Point(
            this.middlePosition().start.X,
            this.middlePosition().start.Y,
        ));
        piece.geoAnimation.endAt(newPosition, 200, function() {
            piece.moving = false;
            this.checkPieceCurrentTile(piece, double);
            if (this.currentPlayer.inJail) {
                this.canPlaySirenAnimation = false;
            }
        }.bind(this));
        piece.moving = true;
    }

    checkPieceCurrentTile(piece, double = false) {
        let currentTile = this.tiles.filter(tile => {
            return (tile.position.X == piece.cartesianPosition.X && tile.position.Y == piece.cartesianPosition.Y);
        })[0];

        if (currentTile) {
            if (currentTile.type === TileType.GO) {
                this.currentPlayer.solde += 200;
                this.checkForDouble(double);
            } else if (currentTile.type === TileType.GOTOJAIL) {
                this.goToJail(piece);
                this.currentPlayer.inJail = true;
                this.messageBox.simple(`You going to jail!!!`, function() { this.messageBox.remove(); }.bind(this));
            } else if (currentTile.type === TileType.LAND || currentTile.type === TileType.RAILROAD || currentTile.type === TileType.COMPANY) {
                if (currentTile.owner) {
                    if (this.currentPlayer.name !== currentTile.owner.name) {
                        if (!currentTile.mortgage) {
                            if (this.currentPlayer.solde >= currentTile.getRent()) {
                                this.payRent(currentTile);
                                this.messageBox.simple(`You paid $${currentTile.getRent()} rent to ${currentTile.owner.name}`, function() {
                                    this.checkForDouble(double);
                                    this.messageBox.remove();
                                }.bind(this));
                            } else {
                                this.needMoney({ action: 'rent', tile: currentTile, value: currentTile.getRent(), required: true }, double);
                            }
                        }
                    }
                } else {
                    let message = `Do you want to buy ${currentTile.streetName} for $${currentTile.purchaseValue}?\nRent Value: $${currentTile.houseRent}\nMoratge Value: $${currentTile.purchaseValue / 2}`;
                    let button1 = {
                        imageOn: './assets/sprites/buttons/yes_on.png',
                        imageOff: './assets/sprites/buttons/yes_off.png',
                        callback: function() {
                            this.buyBlankLand(currentTile);
                            this.messageBox.remove();
                            this.checkForDouble(double);
                        }.bind(this)
                    };
                    if (this.currentPlayer.solde < currentTile.purchaseValue) {
                        button1 = null;
                        message = 'You can\'t buy this property...';
                        this.needMoney({ action: 'buyEmpty', tile: currentTile, value: currentTile.purchaseValue, required: false }, double);
                    } else {

                        this.messageBox.custom(message, button1, {
                            imageOn: './assets/sprites/buttons/no_on.png',
                            imageOff: './assets/sprites/buttons/no_off.png',
                            callback: function() {
                                this.messageBox.remove();
                                this.checkForDouble(double);
                            }.bind(this)
                        });
                    }
                }
            } else if (currentTile.type == TileType.CHANCE) {
                this.getCard('chance', double);
            } else if (currentTile.type == TileType.COMMUNITY) {
                this.getCard('chest', double);
            } else if (currentTile.type == TileType.TAX) {
                if (this.currentPlayer.solde >= currentTile.purchaseValue) {
                    this.payTax(currentTile);
                    this.messageBox.simple(`You paid $${currentTile.purchaseValue} on taxes`, function() {
                        this.checkForDouble(double);
                        this.messageBox.remove();
                    }.bind(this));
                } else {
                    // need more money
                    this.needMoney({ action: 'tax', tile: currentTile, value: currentTile.purchaseValue, required: true }, double);
                }
            }
        }

    }

    needMoney(objectAction, double = false) {
        let required = objectAction.required ? objectAction.required : false;
        let button2 = {
            imageOn: './assets/sprites/buttons/no_on.png',
            imageOff: './assets/sprites/buttons/no_off.png',
            callback: function() {
                this.checkForDouble(double);
                this.messageBox.remove();
            }.bind(this)
        };

        if (required) { button2 = null; }
        if (this.currentPlayer.totalValueForNeedingMoney() >= objectAction.value) {
            this.shortOnMoney = true;
            if (this.engine.sfx)
                this.notifSound.play();
            this.messageBox.custom('You need more money, sell or mortgage, your choice.', {
                imageOn: './assets/sprites/buttons/mortgage_on.png',
                imageOff: './assets/sprites/buttons/mortgage_off.png',
                callback: function() {
                    this.lockNeedMoney = true;
                    this.afterGotMoneyObject = objectAction;
                    this.checkForDouble(double);
                    this.messageBox.remove();
                }.bind(this)
            }, button2);
        } else {
            if (required) {
                this.messageBox.simple('You need more money, but you don\'t have any more properties.\nYour are Bankrupt.', function() {
                    this.lockNeedMoney = false;
                    this.shortOnMoney = false;
                    this.bankrupt(objectAction);
                    this.messageBox.remove();
                }.bind(this), 550, 200);
            } else {
                this.checkForDouble(double);
            }
        }
    }

    verifyBuyingOffers() {
        for (var i = 0; i < this.currentPlayer.myOffers.length; i++) {
            let offerTile = this.currentPlayer.myOffers[i].tile;
            let buyer = this.currentPlayer.myOffers[i].buyer;
            if (buyer.solde >= offerTile.purchaseValue * 2) {
                if (this.engine.sfx)
                    this.notifSound.play();
                this.messageBox.custom(`${buyer.name} want to buy ${offerTile.streetName} for $${offerTile.purchaseValue * 2}, sell?`, {
                    imageOn: './assets/sprites/buttons/sell_on.png',
                    imageOff: './assets/sprites/buttons/sell_off.png',
                    callback: function() {
                        this.currentPlayer.tiles = this.currentPlayer.tiles.filter(tile => {
                            return tile.id != offerTile.id;
                        });
                        offerTile.owner = buyer;
                        buyer.tiles.push(offerTile);
                        buyer.solde -= offerTile.purchaseValue * 2;
                        this.currentPlayer.solde += offerTile.purchaseValue * 2;
                        this.messageBox.remove();
                    }.bind(this)
                }, {
                    imageOn: './assets/sprites/buttons/no_on.png',
                    imageOff: './assets/sprites/buttons/no_off.png',
                    callback: function() {
                        this.messageBox.remove();
                    }.bind(this)
                });
            }
        }

        this.currentPlayer.clearOffers();
    }

    bankrupt(action) {
        if (action) {
            switch (action.action) {
                case 'tax':
                    this.currentPlayer.bankrupt(null);
                    break;
                case 'jail':
                    this.currentPlayer.bankrupt(null);
                    break;
                case 'pay':
                    this.currentPlayer.bankrupt(null);
                    break;
                case 'rent':
                    this.currentPlayer.bankrupt(action.tile.owner);
                    break;
            }

            this.players = this.players.filter(player => {
                return player.name !== this.currentPlayer.name;
            });

            this.endTurn();
        }
    }

    checkForDouble(double) {
        if (double) {
            if (this.doubleCount < 2) {
                this.messageBox.simple(`You have a double`, function() { this.messageBox.remove(); }.bind(this));
                if (this.engine.sfx)
                    this.payedSound.play();
                this.canEnd = false;
                this.canThrow = true;
            } else {
                this.messageBox.simple(`You going to jail!!!`, function() { this.messageBox.remove(); }.bind(this));
                this.goToJail(this.currentPlayer.piece);
                this.currentPlayer.inJail = true;
            }
        }
    }

    goToJail(piece) {
        if (piece) {
            if (this.engine.sfx)
                this.jailSound.play();
            this.canPlaySirenAnimation = true;
            let jailPosition = new Position(10, 10);
            console.log(piece.cartesianPosition);
            console.log(jailPosition);
            let dist = 0;
            if (piece.cartesianPosition.Y == 10)
                dist = parseInt(Math.abs(jailPosition.X - piece.cartesianPosition.X) + Math.abs(jailPosition.Y - piece.cartesianPosition.Y));
            else
                dist = parseInt(Math.abs(piece.cartesianPosition.X - jailPosition.X) + Math.abs(piece.cartesianPosition.Y - jailPosition.Y));
            console.log(dist);
            this.movePiece(piece, dist, false, false);
        }
    }

    getCard(type = 'chance', double = false) {
        this.cards.setPlayer(this.currentPlayer);
        let _cards = this.cards.getCards();
        let typeCards = _cards.filter(card => {
            return card.type === type;
        });
        let index = parseInt(this.getRandomArbitrary(0, typeCards.length));
        this.messageBox.simple(typeCards[index].text, function() {
            if (typeCards[index].action())
                this.messageBox.remove();
            this.checkForDouble(double);
        }.bind(this));
    }

    checkForPassingByGo(piece, position) {
        if (piece) {
            let currentTile = this.tiles.filter(tile => {
                return (tile.position.X == position.X && tile.position.Y == position.Y);
            })[0];
            if (currentTile) {
                if (currentTile.type === TileType.GO) {
                    piece.owner.solde += 200;
                }
            }
        }
    }

    buyBlankLand(tile) {
        if (tile) {
            if (tile.type === TileType.COMPANY) {
                tile.houseRent = this.totalSteps;
            }
            this.currentPlayer.tiles.push(tile);
            tile.owner = this.currentPlayer;
            this.currentPlayer.solde -= tile.purchaseValue;
        }
    }

    payRent(tile) {
        if (tile) {
            if (this.engine.sfx)
                this.failedSound.play();
            this.currentPlayer.solde -= tile.getRent();
            tile.owner.solde += tile.getRent();
        }
    }

    payTax(tile) {
        if (tile) {
            if (this.engine.sfx)
                this.failedSound.play();
            this.currentPlayer.solde -= tile.purchaseValue;
        }
    }

    drawBoardCards() {
        let chance_position = this.isometricPosition(new Position(6, 2), new Size(128, 64), new Point(
            this.middlePosition().start.X,
            this.middlePosition().start.Y,
        ));
        this.engine.drawer.sprite(this.chanceCardsSprites, chance_position);

        let chest_position = this.isometricPosition(new Position(2, 7), new Size(128, 64), new Point(
            this.middlePosition().start.X,
            this.middlePosition().start.Y,
        ));
        this.engine.drawer.sprite(this.chestCardsSprites, chest_position);

    }

    initPieceDirection(piece) {
        if (piece.cartesianPosition.X == 10 && piece.cartesianPosition.Y < 10) {
            piece.setDirection('rightToLeft');
        } else if (piece.cartesianPosition.X > 0 && piece.cartesianPosition.Y == 10) {
            piece.setDirection('bottomToTop');
        } else if (piece.cartesianPosition.X == 0 && piece.cartesianPosition.Y > 0) {
            piece.setDirection('leftToRight');
        } else if (piece.cartesianPosition.X < 10 && piece.cartesianPosition.Y == 0) {
            piece.setDirection('topToBottom');
        }
    }

    calculePosition(piece, steps, salary = true) {
        if (steps < 1)
            return false;

        if (piece.cartesianPosition.X == 10 && piece.cartesianPosition.Y < 10) {
            if (piece.cartesianPosition.Y + steps <= 10) {
                piece.cartesianPosition.Y += steps;
            } else {
                let restY = (steps + piece.cartesianPosition.Y) - 10;
                piece.cartesianPosition.Y = 10;
                if (restY > 0) {
                    let toPosition = this.isometricPosition(piece.cartesianPosition, new Size(128, 64), new Point(
                        this.middlePosition().start.X,
                        this.middlePosition().start.Y,
                    ));;
                    piece.geoAnimation.to(toPosition, 200, function() { piece.setDirection('bottomToTop'); }.bind(this));
                    if (salary)
                        this.checkForPassingByGo(piece, piece.cartesianPosition);
                    this.calculePosition(piece, restY);
                }
            }
        } else if (piece.cartesianPosition.X > 0 && piece.cartesianPosition.Y == 10) {
            if (piece.cartesianPosition.X - steps >= 0) {
                piece.cartesianPosition.X -= steps;
            } else {
                let restX = steps - piece.cartesianPosition.X;
                piece.cartesianPosition.X = 0;
                if (restX > 0) {
                    let toPosition = this.isometricPosition(piece.cartesianPosition, new Size(128, 64), new Point(
                        this.middlePosition().start.X,
                        this.middlePosition().start.Y,
                    ));;
                    piece.geoAnimation.to(toPosition, 200, function() { piece.setDirection('leftToRight'); }.bind(this));
                    if (salary)
                        this.checkForPassingByGo(piece, piece.cartesianPosition);
                    this.calculePosition(piece, restX);
                }
            }
        } else if (piece.cartesianPosition.X == 0 && piece.cartesianPosition.Y > 0) {
            if (piece.cartesianPosition.Y - steps >= 0) {
                piece.cartesianPosition.Y -= steps;
            } else {
                let restY = steps - piece.cartesianPosition.Y;
                piece.cartesianPosition.Y = 0;
                if (restY > 0) {
                    let toPosition = this.isometricPosition(piece.cartesianPosition, new Size(128, 64), new Point(
                        this.middlePosition().start.X,
                        this.middlePosition().start.Y,
                    ));;
                    piece.geoAnimation.to(toPosition, 200, function() { piece.setDirection('topToBottom'); }.bind(this));
                    if (salary)
                        this.checkForPassingByGo(piece, piece.cartesianPosition);
                    this.calculePosition(piece, restY);
                }
            }
        } else if (piece.cartesianPosition.X < 10 && piece.cartesianPosition.Y == 0) {
            if (piece.cartesianPosition.X + steps <= 10) {
                piece.cartesianPosition.X += steps;
            } else {
                let restX = (steps + piece.cartesianPosition.X) - 10;
                piece.cartesianPosition.X = 10;
                if (restX > 0) {
                    let toPosition = this.isometricPosition(piece.cartesianPosition, new Size(128, 64), new Point(
                        this.middlePosition().start.X,
                        this.middlePosition().start.Y,
                    ));;
                    piece.geoAnimation.to(toPosition, 200, function() { piece.setDirection('rightToLeft'); }.bind(this));
                    if (salary)
                        this.checkForPassingByGo(piece, piece.cartesianPosition);
                    this.calculePosition(piece, restX);
                }
            }
        }
    }

    initTilesToBoard() {
        this.tiles = new Tiles().getBoard();
    }

    drawBoard() {
        for (var i = 0; i < this.size.width * this.size.height; i++) {
            if (this.tiles[i]) {
                let position = this.isometricPosition(this.tiles[i].position, this.tiles[i].size, new Point(
                    this.middlePosition().start.X,
                    this.middlePosition().start.Y,
                ));
                this.engine.drawer.sprite(this.tiles[i].sprite, position);
                // this.engine.drawer.text(`(${this.tiles[i].position.X},${this.tiles[i].position.Y})`, position);
            }
        }
    }

    drawBoardHouses() {
        for (var i = 0; i < this.size.width * this.size.height; i++) {
            if (this.tiles[i]) {
                if (this.tiles[i].type === TileType.LAND) {
                    let direction = 'l';
                    if (this.tiles[i].position.X === 0) {
                        direction = 't';
                    } else if (this.tiles[i].position.X === 10) {
                        direction = 'd'
                    } else if (this.tiles[i].position.Y === 0) {
                        direction = 'r';
                    }
                    let house = new House(this.tiles[i].numberHouses, direction, this.tiles[i].position);
                    let position = this.isometricPosition(house.position, this.tiles[i].size, new Point(
                        this.middlePosition().start.X,
                        this.middlePosition().start.Y,
                    ));
                    this.engine.drawer.sprite(house.sprite, position);
                    // this.engine.drawer.text(`(${this.tiles[i].position.X},${this.tiles[i].position.Y})`, position);
                }
            }
        }
    }

    checkForNeedingMoney() {
        if (this.lockNeedMoney) {
            if (this.currentPlayer.solde >= this.afterGotMoneyObject.value) {
                if (this.shortOnMoney) {
                    this.messageBox.simple(`Now your solde is $${this.currentPlayer.solde}, you can pay Now!`, function() {
                        this.executeAfterShort(this.afterGotMoneyObject);
                        if (this.engine.sfx)
                            this.payedSound.play();
                        this.messageBox.remove();
                    }.bind(this), 400, 150);
                    this.shortOnMoney = false;
                }
            }
        }
    }

    executeAfterShort(action) {
        if (action) {
            switch (action.action) {
                case 'tax':
                    this.payTax(action.tile);
                    break;
                case 'rent':
                    this.payRent(action.tile);
                    break;
                case 'buyEmpty':
                    this.buyBlankLand(action.tile);
                    break;
                case 'jail':
                    this.bailOut();
                    break;
                case 'pay':
                    this.currentPlayer.solde -= action.value;
                    break;
            }
        }

        this.lockNeedMoney = false;
    }

    drawPieces() {
        for (var i = 0; i < this.players.length; i++) {
            this.engine.drawer.gameObject(this.players[i].piece);
        }
    }

    middlePosition() {
        let width = this.engine.screenSize().width;
        let height = this.engine.screenSize().height;
        let x = (width / 2) - 50;
        let y = 50;
        let maxX = (width / 2);
        let maxY = (height / 2);
        return { start: new Point(x, y), end: new Point(maxX, maxY) };
    }

    cartesianPosition(position, size) {
        let x = ((position.X - this.middlePosition().start.X) / (size.width / 2) + (position.Y - this.middlePosition().start.Y) / (size.height / 2)) / 2;
        let y = ((position.Y - this.middlePosition().start.Y) / (size.height / 2) - (position.X - this.middlePosition().start.X) / (size.width / 2)) / 2;
        return new Position(parseInt(x), parseInt(y));
    }


    isometricPosition(position, size, offset) {
        let x = (position.X - position.Y) * (size.width / 2);
        let y = (position.X + position.Y) * (size.height / 2);
        return new Position(parseInt(x + offset.X), parseInt(y + offset.Y));
    }

    giveTurn() {
        if (this.players.length > 0) {
            if (this.currentPlayerIndex == -1) {
                this.currentPlayerIndex = 0;
                this.currentPlayer = this.players[this.currentPlayerIndex];
                this.bottomBar.setPlayer(this.currentPlayer);
                this.cards.setPlayer(this.currentPlayer);
                return true;
            }
            if (this.currentPlayerIndex + 1 < this.players.length) {
                this.currentPlayerIndex++;
                this.currentPlayer = this.players[this.currentPlayerIndex];
                this.cards.setPlayer(this.currentPlayer);
                this.bottomBar.setPlayer(this.currentPlayer);
                return true;
            }

            this.currentPlayerIndex = 0;
            this.currentPlayer = this.players[this.currentPlayerIndex];
            this.cards.setPlayer(this.currentPlayer);
            this.bottomBar.setPlayer(this.currentPlayer);
            return true;
        }
    }

    endTurn() {
        this.sidePlayers.viewedPlayer = null;
        this.giveTurn();
        // check jail
        if (this.currentPlayer.inJail) {
            this.bailOut();
        }
        this.verifyBuyingOffers();
        this.canThrow = true;
    }

    bailOut() {
        if (this.currentPlayer.solde >= 50) {
            this.messageBox.custom('Pay your Bail out of Jail?', {
                imageOn: './assets/sprites/buttons/yes_on.png',
                imageOff: './assets/sprites/buttons/yes_off.png',
                callback: function() {
                    this.currentPlayer.solde -= 50;
                    this.currentPlayer.inJail = false;
                    this.currentPlayer.doubleCount = 0;
                    this.messageBox.remove();
                }.bind(this)
            }, {
                imageOn: './assets/sprites/buttons/no_on.png',
                imageOff: './assets/sprites/buttons/no_off.png',
                callback: function() {
                    this.messageBox.remove();
                }.bind(this)
            });
        } else {
            this.needMoney({ action: 'jail', value: '50' });
        }
    }

    playSirenAnimation() {
        if (this.canPlaySirenAnimation) {
            this.sirenAnimation.update();
            this.engine.drawer.spriteSheet(this.sirenAnimation, new Position((this.engine.screenSize().width / 2) - 400, (this.engine.screenSize().height / 2) - 75));
        }
    }
}