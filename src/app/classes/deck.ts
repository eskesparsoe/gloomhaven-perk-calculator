export class Deck {
    public cards = {
        x0: 1,
        '-2': 1,
        '-1': 5,
        '+0': 6,
        '+1': 5,
        '+2': 1,
        '+3': 0,
        '+4': 0,
        x2: 1,
        'r+1': 0,
        'r+2': 0,
    };

    private cardValue = {
        x0: -1000,
        '-2': -2,
        '-1': -1,
        '+0': 0,
        '+1': 1,
        '+2': 2,
        '+3': 3,
        '+4': 4,
        x2: 1000,
        'r+1': 1,
        'r+2': 2,
    };

    public getCardTypes() {
        return Object.keys(this.cards);
    }

    public sum(cards = this.cards): number {
        return Object.values(cards).reduce((prev, cur) => prev + cur);
    }

    public rollingSum(cards = this.cards): number {
        let sum = 0;
        for (const key of Object.keys(cards)) {
            sum += key.startsWith('r') ? cards[key] : 0;
        }
        return sum;
    }

    public nonRollingSum(cards = this.cards): number {
        let sum = 0;
        for (const key of Object.keys(cards)) {
            sum += !key.startsWith('r') ? cards[key] : 0;
        }
        return sum;
    }

    public cardChance(cardType: string): number {
        return Math.round((this.cards[cardType] / this.sum()) * 100);
    }

    /*
    private cloneCards(cards = this.cards) {
        const newCards = new Object();
        for (const key of Object.keys(cards)) {
            Object.defineProperty(newCards, key, {});
            newCards[key] = cards[key];
        }
        return newCards;
    }
    */

    private getReliability(cards = this.cards, rollingValue = 0, compareFunc: (x: number) => boolean) {
        /*
        let compareFunc: (x: number) => boolean;


        if (compare === 0) {
            compareFunc = (x: number) => x === 0;
        } else if (compare < 0) {
            compareFunc = (x: number) => x < 0;
        } else if (compare > 0) {
            compareFunc = (x: number) => x > 0;
        }
        */

        /*
        let probability = 0;

        for (const cardType of Object.keys(cards)) {
            if (cardType.startsWith('r') && cards[cardType] > 0) {
                const sum = this.sum(cards);
                const newCards = Object.assign({}, cards);
                newCards[cardType] -= 1;

                let tempProbability = (sum - cards[cardType]) / sum;
                tempProbability *= this.getReliability(newCards, this.cardValue[cardType], compareFunc) / (sum - 1);
                probability += tempProbability;
            } else if (compareFunc(rollingValue + this.cardValue[cardType])) {
                probability += cards[cardType] / this.sum(cards);
            }
        }

        return probability;
        */

        let probability = 0;

        for (const cardType of Object.keys(cards)) {
            // Ignore cards not in deck
            if (cards[cardType] === 0) {
                continue;
            }

            if (!cardType.startsWith('r') && compareFunc(rollingValue + this.cardValue[cardType])) {
                probability += cards[cardType] / this.sum(cards);
            } else if (cardType.startsWith('r')) {
                const newCards = Object.assign({}, cards);
                newCards[cardType] -= 1;

                probability += (cards[cardType] / this.sum(cards))
                    * this.getReliability(newCards, rollingValue + this.cardValue[cardType], compareFunc);
            }
        }

        return probability;

    }

    public reliabilityNegative() {
        const compareFunc = (x: number) => x < 0;
        const probability = this.getReliability(this.cards, 0, compareFunc);
        return probability * 100;
    }

    public reliabilityZero() {
        const compareFunc = (x: number) => x === 0;
        const probability = this.getReliability(this.cards, 0, compareFunc);
        return probability * 100;
    }

    public reliabilityPositive() {
        const compareFunc = (x: number) => x > 0;
        const probability = this.getReliability(this.cards, 0, compareFunc);
        return probability * 100;
    }

    public addCard(cardType: string) {
        this.cards[cardType]++;
    }

    public removeCard(cardType: string) {
        if (this.cards[cardType] > 0) { this.cards[cardType]--; }
    }
}