class Player {

    constructor(name) {
        this.name = name;
        this.piece = null;
        this.solde = 150;
        this.tiles = [];
        this.InJail = false;
        this.doubleCount = 0;
    }

    railRoadCount(mortgage = false) {
        if (mortgage) {
            return this.tiles.filter(tile => {
                return tile.type === TileType.RAILROAD && tile.mortgage;
            }).length;
        }
        return this.tiles.filter(tile => {
            return tile.type === TileType.RAILROAD;
        }).length;
    }

    companiesCount(mortgage = false) {
        if (mortgage) {
            return this.tiles.filter(tile => {
                return tile.type === TileType.COMPANY && !tile.mortgage;
            }).length;
        }
        return this.tiles.filter(tile => {
            return tile.type === TileType.COMPANY;
        }).length;
    }

    totalPropertiesValues() {
        let total = 0;
        let tiles_to_mortgage = this.tiles.filter(tile => {
            return !tile.mortgage;
        });
        for (var i = 0; i < tiles_to_mortgage.length; i++) {
            total += tiles_to_mortgage[i].getMortgageValue();
        }

        return total;
    }

    totalValueForNeedingMoney() {
        return this.totalPropertiesValues() + this.solde;
    }

    canBuild(tile) {
        if (tile) {
            return this.getTileGroup(tile.groupId, true).length === tile.groupTotal;
        }
    }

    getTileGroup(groupId, mortgage = false) {
        if (groupId) {
            if (mortgage) {
                return this.tiles.filter(tile => {
                    return tile.groupId === groupId && !tile.mortgage;
                });
            } else {

                return this.tiles.filter(tile => {
                    return tile.groupId === groupId;
                });
            }
        }
    }

    getSortedTiles() {
        return this.tiles.sort(this.compare);
    }

    compare(a, b) {
        if (a.groupId < b.groupId) {
            return -1;
        }
        if (a.groupId > b.groupId) {
            return 1;
        }
        return 0;
    }

    mortgageTileById(id) {
        let tile = this.tiles.filter(tile => {
            return tile.id === id;
        })[0];

        if (tile) {
            if (tile.type === TileType.LAND || tile.type === TileType.COMPANY || tile.type === TileType.RAILROAD) {
                if (!tile.mortgage) {
                    tile.mortgage = true;
                    this.solde += tile.getMortgageValue();
                    return true;
                }
            }
        }

        return false;
    }

    payMortgageTileById(id) {
        let tile = this.tiles.filter(tile => {
            return tile.id === id;
        })[0];

        if (tile) {
            if (tile.type === TileType.LAND || tile.type === TileType.COMPANY || tile.type === TileType.RAILROAD) {
                if (tile.mortgage && this.solde >= tile.getMortgagePayement()) {
                    tile.mortgage = false;
                    this.solde -= tile.getMortgagePayement();
                    return true;
                }
            }
        }

        return false;
    }

    bankrupt(newOwner = null) {
        for (var i = 0; i < this.tiles.length; i++) {
            this.tiles[i].owner = newOwner;
        }
    }

}