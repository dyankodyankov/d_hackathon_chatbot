sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	var sScrollToId = 0;
	var conversationID;

	return Controller.extend("sap.com.ui.controller.Main", {
		onInit: function () {
			this.oChatModel = new JSONModel({
				chat: []
			});
			this.getView().setModel(this.oChatModel, "chatmodel");
			this.oModel = this.getView().getModel("chatmodel");
			this.aData = this.oModel.getProperty("/chat");
		},

		onAfterRendering: function () {
			var that = this;
			this.byId("MessageInput").onkeyup = function (oEvent) {
				if (oEvent.key === "Enter") {
					that.onSendChat();
				}
			};

			function guid() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
				}
				
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
			}
			conversationID = guid();
			
			this.sendInitialMessage();
		},

		sendInitialMessage: function () {
			var enteredData = {
				question: '"!/()=?;:"',
				convid: conversationID
			};
			this.onSendMessageToBot(enteredData);
		},

		onSendMessageToBot: function (message) {
			var that = this;
			$.ajax({
				type: "POST",
				url: "/server/api/askQuestion",
				crossDomain: true,
				datatype: 'json',
				context: this,
				contentType: "application/json",
				data: JSON.stringify(message),
				success: function (data) {
					var oAddMsg = function (oMsg) {
						return new Promise(function () {
							that.aData.push(oMsg);
							that.oModel.setProperty("/chat", that.aData);
							sScrollToId++;
							that.byId("chatList").setBusy(false);
						});
					};
					for (var i = 0; i < data.length; i++) {
						that.oMsg = JSON.parse(JSON.stringify(data[i]));
						oAddMsg(JSON.parse(JSON.stringify(that.oMsg)));
					}
				},
				error: function (err) {

				}
			});
		},

		onPressAnyButton: function (oEvent) {
			var value = oEvent.getSource().getAggregation("customData")[0].getProperty("value");
			var type = oEvent.getSource().getAggregation("tooltip");

			if (type === "web_url") {
				var win = window.open(value, '_blank');
				win.focus();
			} else if (type === "phonenumber") {
				window.location.href = "tel://" + value;
			} else if (type === "postback") {
				this.onSendChat(value);
			}
		},

		onCloseDialog: function () {
			this.oProcurementDialog.close();
		},

		onSendChat: function (message) {
			if (this.byId("MessageInput").getValue()) {
				message = this.byId("MessageInput").getValue();
			}
			this.enteredData = {
				question: message,
				convid: conversationID
			};

			this.byId("MessageInput").setValue("");
			var userInput = {
				content: this.enteredData.question,
				author: "user",
				type: "text"
			};
			sScrollToId++;
			this.aData.push(userInput);
			this.oModel.setProperty("/chat", this.aData);
			this.onSendMessageToBot(this.enteredData);
		},

		scrollToLastMessage: function (oEvent) {
			window.setTimeout(function () {
				document.getElementById("__box0-__xmlview0--chatList-" + (sScrollToId - 1)).scrollIntoView();
			}, 50);
		}
	});
});