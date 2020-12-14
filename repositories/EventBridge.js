const AWS = require("aws-sdk")

const eventbridge = new AWS.EventBridge({apiVersion: '2015-10-07'});

class EventBridge {
    constructor(eventBusName) {
        if(!eventBusName) {
            throw new Error("EventBusName parameter is mandatory")
        }
        this.eventBusName = eventBusName;
        console.log("AWS promotion repository");
    }

    async sendPromotion(promotion) {
        const params = {
            Entries: [
                {
                    Detail: JSON.stringify(promotion),
                    DetailType: "NEW_PROMOTION",
                    EventBusName: this.eventBusName,
                    Source: 'henripotier.api',
                    Time: new Date()
                }
            ]
        };

        const responseEvent = await eventbridge.putEvents(params).promise();
        console.log("Response for putEvent", responseEvent);
    }
}

module.exports = EventBridge
