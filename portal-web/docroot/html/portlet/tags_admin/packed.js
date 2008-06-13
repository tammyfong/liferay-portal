Liferay.Portlet.TagsAdmin=new Class({initialize:function(F){var N=this;N._categoriesCount=0;N._entriesInCurCategoryCount=0;N._searchFilters={};N.params=F;var I=jQuery("#"+F.addCategoryNameInput);var M=jQuery("#"+F.addEntryButton);var G=jQuery("#"+F.addEntryNameInput);var H=jQuery("#"+F.addPropertyButton);var J=jQuery("#"+F.addToCategorySpan);var B=jQuery("#"+F.cancelEditEntryButton);var D=jQuery("#"+F.deleteEntryButton);var K=jQuery("#"+F.editEntryFields);var E=jQuery("#"+F.editEntryNameInput);var A=jQuery("#"+F.form);var L=jQuery("#"+F.keywordsInput);var C=jQuery("#"+F.updateEntryButton);N._form=A;N._getEntries(N);K.hide();A.submit(function(){return false});I.val("");I.keypress(function(O){if(O.keyCode==13){N._addEntry(N)}});G.keypress(function(O){if(O.keyCode==13){N._addEntry(N)}});E.keypress(function(O){if(O.keyCode==13){N._updateEntry(N)}});L.keyup(function(O){if([16,17,18,35,36,37,38,39,40].indexOf(O.which)==-1){N._searchEntries(N)}});L.val("");M.click(function(){N._addEntry(N)});H.click(function(){var O=N._addProperty(N,"0","","");N._addProperties(N,O)});B.click(function(){K.hide()});D.click(function(){N._deleteEntry(N,N._entryId)});C.click(function(){N._updateEntry(N)})},deleteEntry:function(A,B){A._deleteEntry(A,B)},editEntry:function(A,E,C){var G=A.params;A._entryId=E;var B=jQuery("#"+G.editEntryFields);var F=jQuery("#"+G.editEntryNameInput);var D=jQuery("#"+G.propertiesTable);F.val(C);D.find("tr").slice(-1).remove();Liferay.Service.Tags.TagsProperty.getProperties({entryId:E},function(H){A._editProperties(A,H)});B.show()},_addEntry:function(I){var D=I.params;var C=D.instanceVar;var E=jQuery("#"+D.addEntryNameInput);var G=jQuery("#"+C+"categorySel");var A=jQuery("#"+C+"CategoryFilterSel");var B=G.val();if(B=="[new]"){var F=jQuery("#"+D.addCategoryNameInput);B=jQuery.trim(F.val());if(B){I._searchFilters["category"]=B;F.hide()}else{B="no category"}}var H=new Array("0:category:"+B);if(B=="[none]"){H=null}Liferay.Service.Tags.TagsEntry.addEntry({name:E.val(),properties:H},function(J){if(!J.exception){I._getEntries(I)}else{if(J.exception.indexOf("com.liferay.portlet.tags.DuplicateEntryException")>-1){I._sendMessage("error","that-tag-already-exists")}else{if(J.exception.indexOf("com.liferay.portlet.tags.EntryNameException")>-1){I._sendMessage("error","one-of-your-fields-contain-invalid-characters")}}jQuery("#"+D.addCategoryNameInput).show()}});I._resetFields(I);E.focus()},_addProperties:function(A,D){var E=A.params;var C=E.instanceVar;var B=jQuery("#"+E.propertiesTable);B.append(D);B.find("tr").each(function(F,G){jQuery("input[@name="+C+"deletePropertyButton]",G).click(A._deleteProperty);jQuery("input[@name="+C+"propertyValue]",G).keypress(function(H){if(H.keyCode==13){A._updateEntry(A)}})})},_addProperty:function(A,G,D,E){var F=A.params;var C=F.instanceVar;var B="";B+="<tr><td>";B+="<input name=\""+C+"propertyId\" type=\"hidden\" value=\""+G+"\" />\n";B+="<input";if(D=="category"){B+=" disabled"}B+=" name=\""+C+"propertyKey\" type=\"text\" value=\""+D+"\" />\n";B+="<input name=\""+C+"propertyValue\" type=\"text\" value=\""+E+"\" />\n";if(D!="category"){B+="<input name=\""+C+"deletePropertyButton\" type=\"button\" value=\"Delete\" />\n"}B+="</td></tr>";return B},_deleteEntry:function(A,D){var E=A.params;if(confirm(Liferay.Language.get("are-you-sure-you-want-to-delete-this-tag"))){var C=E.instanceVar;var B=jQuery("#"+E.editEntryFields);Liferay.Service.Tags.TagsEntry.deleteEntry({entryId:D},function(){if(((A._searchFilters["category"]!="all")||(A._categoriesCount==1))&&(A._entriesInCurCategoryCount==1)){A._searchFilters["category"]="all";jQuery("#"+E.addCategoryNameInput).show()}A._getEntries(A)});B.hide()}},_deleteProperty:function(){jQuery(this).parents("tr").eq(0).remove()},_displayEntries:function(A,F,E){var G=A.params;var D=G.instanceVar;var C=jQuery("#"+G.searchResultsDiv);var H=Liferay.Language.get("are-you-sure-you-want-to-merge-x-into-x",["{SOURCE}","{DESTINATION}"]);var B="<br />";A._categoriesCount=F.length;C.html("");jQuery.each(F,function(I,J){if(A._searchFilters["category"]==null||A._searchFilters["category"]=="all"||A._searchFilters["category"]==J.value){Liferay.Service.Tags.TagsEntry.search({companyId:themeDisplay.getCompanyId(),name:E,properties:"category:"+J.value},function(K){if(J.value!=""){B+="<div class=\"tags-category\"><b>"+J.value+"</b></div>"}B+="<div class=\"tags-container\">";jQuery.each(K,function(N,O){var M=D+".editEntry("+D+", "+O.entryId+", '"+encodeURIComponent(O.name)+"');";var P=K.length;B+="<div class=\"tag\">";B+=" <a class=\"tag-name\" href=\"javascript: "+M+"\" tagId=\""+O.entryId+"\">"+O.name+"</a>";B+=" <a href=\"javascript: "+D+".deleteEntry("+D+", "+O.entryId+")\">[x]</a>";if((N+1)<K.length){B+="<br />"}B+="</div>"});B+="</div>";if(K.length==0){B+=Liferay.Language.get("no-tags-found")}C.html(B);var L=C.find(".tag");L.draggable({zIndex:1000,ghosting:true,opacity:0.7,revert:true});L.droppable({accept:".tag",activeClass:"drop-zone",hoverClass:"drop-hover",tolerance:"pointer",drop:function(N,R){var V=R.draggable;var Q=jQuery(this);var S=V.find("a.tag-name");var T=Q.find("a.tag-name");var P=V.attr("tagId");var O=Q.attr("tagId");var M={SOURCE:S.text(),DESTINATION:T.text()};var U=H.replace(/\{(SOURCE|DESTINATION)\}/gm,function(Z,X,W,Y){return M[X]});if(confirm(U)){jQuery.data(V[0],"draggable").options.revert=false;Liferay.Service.Tags.TagsEntry.mergeEntries({fromEntryId:P,toEntryId:O},function(){V.remove();jQuery("div.tag[@tagId="+P+"]").remove()})}}})})}})},_displayFilters:function(M,F,K){var D=M.params;var C=D.instanceVar;var A=jQuery("#"+D.searchPropertiesSpan);var I=jQuery("#"+D.addToCategorySpan);var L="";var H="";jQuery.each(K,function(O,Q){var P="";if(Q.value==M._searchFilters["category"]){P=" selected"}var N="<option value=\""+Q.value+"\""+P+">"+Q.value+"</option>";L+=N;if(Q.value!="no category"){H+=N}});L="<select id=\""+C+F+"FilterSel\"><option>all</option>"+L+"</select>";var E="";if(M._searchFilters["category"]=="no category"){E="selected"}H="<select id=\""+C+F+"Sel\"><option value=\"[new]\">(New)</option><option value=\"no category\""+E+">(None)</option>"+H+"</select>";A.append("<span style=\"padding: 0px 5px 0px 10px;\">"+F+"</span>");A.append(L);I.append("<span style=\"padding: 0px 5px 0px 10px;\">"+H+"</span>");var G=jQuery("#"+D.addCategoryNameInput);var B=jQuery("#"+C+F+"FilterSel");var J=jQuery("#"+C+"categorySel");B.change(function(){M._searchFilters[F]=this.value;if(this.value=="all"){J.val("[new]");G.show()}else{J.val(this.value);G.hide()}M._searchEntries(M)});J.change(function(){M._searchFilters[F]=this.value;if(this.value=="[new]"){B.val("[all]");G.show()}else{B.val(this.value);G.hide()}M._searchEntries(M)})},_editProperties:function(A,C){var B="";jQuery.each(C,function(D,E){B+=A._addProperty(A,E.propertyId,E.key,E.value)});if(C.length==0){B+=A._addProperty("0","","")}A._addProperties(A,B)},_getEntries:function(A){A._resetFields(A);Liferay.Service.Tags.TagsProperty.getPropertyValues({companyId:themeDisplay.getCompanyId(),key:"category"},function(B){A._displayEntries(A,B,"%")});A._getFilters(A)},_getFilters:function(A){var F=A.params;var C=F.instanceVar;var B=jQuery("#"+F.searchPropertiesSpan);var E=jQuery("#"+F.addToCategorySpan);var D=new Array("category");if(D.length>0){B.html("Filter By: ");E.html("Add To: ")}jQuery.each(D,function(G,H){Liferay.Service.Tags.TagsProperty.getPropertyValues({companyId:themeDisplay.getCompanyId(),key:H},function(I){A._displayFilters(A,H,I)})})},_resetFields:function(A){var E=A.params;var D=jQuery("#"+E.addCategoryNameInput);var C=jQuery("#"+E.addEntryNameInput);var B=jQuery("#"+E.keywordsInput);D.val("");C.val("");B.val("")},_searchEntries:function(A){var E=A.params;var B=jQuery("#"+E.keywordsInput);var D="%"+B.val()+"%";var C=jQuery("#"+E.searchResultsDiv);C.html("");Liferay.Service.Tags.TagsProperty.getPropertyValues({companyId:themeDisplay.getCompanyId(),key:"category"},function(F){A._displayEntries(A,F,D)})},_sendMessage:function(E,D){var A=this;var B="portlet-msg-error";if(E=="success"){B="portlet-msg-success"}var F=Liferay.Language.get(D);var C=jQuery(".lfr-message-response");if(C.length){C.removeClass("portlet-msg-success").removeClass("portlet-msg-error");C.addClass(B);C.fadeIn("fast")}else{C=jQuery("<div class=\""+B+" lfr-message-response\">"+F+"</div>");A._form.prepend(C)}var G=setTimeout(function(){C.fadeOut("slow");clearTimeout(G)},7000)},_updateEntry:function(A){var H=A.params;var E=H.instanceVar;var G=jQuery("#"+H.editEntryNameInput);var B=jQuery("#"+H.editEntryFields);var D=jQuery("#"+H.propertiesTable);var C="";var F=D.find("tr");F.each(function(J,M){var L=jQuery("input[@name="+E+"propertyId]",M).val();var K=jQuery("input[@name="+E+"propertyKey]",M).val();var I=jQuery("input[@name="+E+"propertyValue]",M).val();C+=L+":"+K+":"+I;if((J+1)<F.length){C+=","}});Liferay.Service.Tags.TagsEntry.updateEntry({entryId:A._entryId,name:G.val(),properties:C},function(I){if(!I.exception){A._getEntries(A)}else{if(I.exception.indexOf("Exception")>-1){A._sendMessage("error","one-of-your-fields-contain-invalid-characters")}}});B.hide()}})