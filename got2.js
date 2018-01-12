$(function () {
var jqconsole = $('#console').jqconsole('GAME OF THRONES: The Game.\n', ':> ');

var inventory = {};
var inv_global = {};
var global_vars = {"playing":true,
"cloak_status": false, 
"cat_mad":true, 
"cook_status":true,
"pepper":false, 
"onion":false, 
"flagon":false, 
"robert":false,
"kill_assassin":false,
"robert_note":false,
"robert_leave":false,
"assassin_attack":false,
"note_guard":false,
"brood":true,
"have_knife":false,
"robert_scroll":false,
"recover_room":false};

//verb functions ---------------------------



var to_print = function(printthis){
  jqconsole.Write(printthis + '\n', 'jqconsole-output');
};

var help = function(){
  to_print("\ninv = view inventory \nlook = look around the area \nlook [object] = look at an object in the room or your inventory \ntake [object] = pick up item \nuse [item] = use an item from your inventory on yourself \nuse [item] [object] = use an item from your inventory on an object \ngo [north/south/east/west] = go to adjacent area \ntalk [person] = talk to a person in the room");
};

var setup_room = function(room){
  for (item in room[2]){
      if (item in inv_global){
          room[1][item] = "";      
          room[2][item] = "";
      };
  };
  for (action in global_actions){
      room[5][action] = global_actions[action];
  };
  return room
};

var look = function(action, room){
    if (action.length > 1){
      look_item(action[1],room);
    }
    else {
      look_room(room);
    }
};


var look_item = function(item, room){
    var templist = {};
    for (key in inventory){
        templist[key] = true;
        if (key == item){
            to_print(inventory[key]);
            break;
        };
    };
    for (key in room[2]){
        templist[key] = true;
        if (key == item){
            to_print(room[2][key]);
            break;
        };
    };
    for (key in room[3]){
        templist[key] = true;
        if (key == item){
            to_print(room[3][key]);
            break;
        };
    };
    if (!(item in templist)){
        to_print("You see nothing interesting about it.");
    }
 }

var look_room = function(room){
    to_print("\n");
    to_print(room[0]);
    for (item in room[1]){
        to_print(room[1][item]);
    };
};

var take = function(item, room){
    if (!(item in inv_global)){
        var templist = {};
        for (key in inventory){
            if (key === item){
                to_print("You already took the " + item);
                return room;
            }
        };
        for (key in room[2]){
            templist[key] = true;
            if (key === item){
                to_print("You take the " + item);
                inventory[key] = room[2][key];
                inv_global[key] = true;
                room[2][key] = "";
                room[1][key] = "";
                return room;
            }
        };
        if (!(item in templist)){
            to_print("That would be useless to you.");
        return room;
    }
    }
    else {
        to_print("You already took the " + item);
        return room;
    }
}

var use_item = function(item){
    if (item in inventory){
        return item;
    }
    else{
        to_print("You do not have a " + item);
    }
}

var get_inv = function(){
    for (key in inventory){
        to_print(key);
    };
}

var talk = function(person, room){
    var templist = {};
    for (key in room[4]){
        templist[key] = true;
        if (key === person){
            if (typeof room[4][key] === 'string'){
                to_print(room[4][key]);
            }
            else{
                room[4][key];
            }
        }
    };
    if (!(person in templist)){
        to_print(person + " is not here.");
    }
}
     

  var use = function(actions, avail){
      templist = {};
      if (actions.length === 3){
          action_string = use_item(actions[1])+"-"+actions[2];
      }
      else if (actions.length == 2){
          action_string = use_item(actions[1]);
      }
      for (key in avail){
          templist[key] = true;
          if (key == action_string){
              if (typeof avail[key] === "string"){
                  to_print(avail[key]);
              }
              else{
                  avail[key](use_item(actions[1]));
              }
          }
      };
      if (!(action_string in templist)){
          to_print("That would do no good.");
      }
  }

    var use_cloak = function(cloak){
        if (global_vars['cloak_status']){
            to_print("You remove your cloak.");
            global_vars['cloak_status'] = false;
        }
        else{
            to_print("You put on your cloak.");
            global_vars['cloak_status'] = true;
        }
    }

//Plot actions --------------------------------------------------------

var cat_flower = function(flower){
    global_vars['cat_mad'] = false;
    delete inventory['flower'];
    delete inv_global['flower'];
    to_print("Catelyn's face softens. \"Oh, Ned.\"\nYou take her in your arms and say, \"I did not choose this 'honor'. But I cannot deny Robert, and we will make do in King's Landing.\"");
    to_print("\"I know,\" she says,\" I do not know why I feel this terrible sense of dread. But thank you, I feel much better now.\"");
}

var flagon = function(flagon){
    if ((global_vars['onion']) && (global_vars['pepper'])){
        to_print("You fill the flagon with your much improved soup.");
        global_vars["flagon"] = true;
        inventory["flagon"] = "The flagon is full of soup.";
    }
    else{
        to_print("The soup is not worth taking yet.");
    }
}

var flagon_robert = function(flagon){
    if (global_vars['flagon']){
        to_print("You give the flagon of much improved soup to Robert.\n\"Maybe I was wrong about you Northerners, Ned, this does warm the belly! \nThough I'd rather the flagon be filled with ale! Hah!\" \n\n He remembers something and his face becomes serious. \n\"Why don't you meet me in the crypts? I'd like to say farewell to Lyanna befoe we go.\"");
        delete inventory['flagon'];
        global_vars["robert"] = true;
    }
    else{
        to_print("\"You know better than to offer me an empty flagon, Ned!\"");
    }
}

var note_guard = function(note){
    global_vars['note_guard'] = true;
    to_print("You show Robert's note to the guard.\n\"Hmmm King Robert has granted you his command, eh? And this IS his seal. Very well, enter.\"\nThe guard gives you a sideways glance and steps aside.");
}

var soup_ingredient = function(ingred){
    delete inventory[ingred];
    global_vars[ingred] = true;
    if ((global_vars['onion']) && (global_vars['pepper']))
    {
        to_print("\"Now the soup should be fit for a king.\"");
    }
    else{
        to_print("\"This " + ingred + " should make the soup taste a little better.\"");
    }
}

var knife_robert = function(knife){
    to_print("You show Robert the assassin's knife that bears his family crest.\nRecognition flashes across his eyes. \"Where'd you get this?\" He demands.\n\"A man tried to kill me with it,\" you reply, \"somebody close to you must object to my ascension to Hand.\"\nRobert scowls. He seems to sober a bit.\n\"I must alert King's Landing. We'll send a message at once. \"\n\nRobert walks to the table and scribbles a note on a small scroll.\nHe rolls it tight, stamps his seal in wax, and hands it to you.\n\"Move quickly, and be alert.\"");
    global_vars['robert_scroll'] = true;
    inventory["scroll"] = "The small scroll Robert gave you. You will not betray his trust by opening it.";
    inv_global["scroll"] = true;
}

var scroll_raven = function(scroll){
    to_print("You carefully tie the scroll around the raven's leg.\n\nThe bird flies from the window, then over the wall and above the woods beyond.\nIts wings beat a slow rhythm into the midday sky. \n\nAnd then, with a jolt, it begins to fall.\nThe raven tumbles through the air in a lopsided spiral, orbiting the end of an arrow.\n\nYou whisper a prayer.\n\nTO BE CONTINUED...");
}

//Rooms ------------------------------------------------------------------------------

var start = function(){
    to_print(" __ .__..  ..___  .__..___  .___..  ..__ .__..  ..___ __.\n[ __[__]|\\/|[__   |  |[__     |  |__|[__)|  ||\\ |[__ (__ \n[_./|  ||  |[___  |__||       |  |  ||  \\|__|| \\|[___.__)\n\nThe Game.\n\n\nINSTRUCTIONS:\ninv = view inventory\nlook = look around the area\nlook [object] = look at an object in the room or your inventory\ntake [object] = pick up item\nuse [item] = use an item from your inventory on yourself\nuse [item] [object] = use an item from your inventory on an object\ngo [north/south/east/west] = go to adjacent area\ntalk [person] = talk to a person in the room\nhelp = print these instructions to the screen\n\nA letter arrives from King's Landing:\n\n***************************************************\nNed,\nJon Arryn is dead.\nI will be arriving in Winterfell in two week's time.\n-Robert\n***************************************************\n\nTwo weeks later, King Robert arrives with his men.\nHe asks that you replace Jon as hand.\nAgainst your better judgement, you accept his offer.\nRobert is pleased.\nYour wife, Catelyn, will not be.\nYou walk to your bedchambers...\n");
    return 'chambers'
}

var chambers = function(){
    var room = ["Catelyn sits near the hearth, gazing into the fire.\nA window overlooks the yard below. You hear faint voices outside.\nA spiral staircase descends downwards to the EAST.\nThe door to your chambers opens to the NORTH.",
    {"cloak":"Your cloak hangs on the door."}, 
    {"cloak":"Your warm fur cloak has seen you through many winters."},
    {"window":"In the yard below, your sons shoot arrows at a straw man. You chuckle as Bran misses wide.", "catelyn":"Catelyn sighs and continues to stare into the fire.","fire":"You stare into the flames ... and see nothing.","hearth":"A small fire crackles in the hearth."},
    {"catelyn":"\"I must serve my king, it is my duty,\" you say. She replies, \"Yes, but what of your family?\".","bran":"You yell a word of encouragement out the window. Bran looks up at you and smiles. Then misses again."},
    {"dirk-catelyn":"A dark thought passes through your mind.  But no...","cloak-catelyn":"\"It's warm enough in here already, Ned.\"","onion-catelyn":"\"You know I despise the tast of onions.\"","potato-catelyn":"\"I'm not hungry, Ned\"","flower-catelyn":cat_flower}];
    room = setup_room(room);
    var go = false;
    to_print("\nBEDCHAMBER:\nYou are in your chambers.");
    if (global_vars['brood']){
        to_print("Catelyn broods near the fire.");
        global_vars['brood'] = false;
    }
    if (global_vars['cat_mad'] === false){
        room[4]['catelyn'] = "\"I love you, Ned, but I still feel something is amiss.\"";
    }
    if (global_vars['assassin_attack']){
        room[4]['catelyn'] = "\"I had a feeling something terrible was coming. \nI know Robert loves you, but we cannot trust the rest of these Southerners. \nYou must warn him of this treason, and you must be sure he believes you.\"";
        room[5]['knife-catelyn'] = "\"This is evidence enough that Robert's men have conspired against you. You must tell him at once.\"";
    }
    var subfunc = function(){    
        var input = jqconsole.Prompt(false, function(action){
            action = action.split(" ");
            if (action[0] == "help"){
                help();
            }

            else if (action[0] == "look"){
                look(action, room);
            }

            else if (action[0] == "take"){
                if (action.length > 1){
                    room = take(action[1], room);
                }
                else{
                    to_print("Take what?");
                }
            }

            else if (action[0] == "go"){
                if (action[1] == "east"){
                    go = true;
                    return 'glass_gardens';
                }
                else if (action[1] == "north"){
                    go = true;
                    return 'hallway';
                }
                else{
                    to_print("You cannot go in that direction.");
                }
            }

            else if (action[0] == "use"){
                use(action, room[5]);
            }

            else if (action[0] == "talk"){
                if (action.length > 1){
                    talk(action[1],room);
                }
                else{
                    to_print("You curse yourself under your breath.");
                }
            }
            
            else if (action[0] == "inv"){
                get_inv();
            }

            else{
                to_print("Your actions yield no result.");
            }
            return subfunc();
        });
        return input;
    };
subfunc();
}

var global_actions = {"onion":"You are not hungry. Besides, you have a feeling you'll need it later.","dirk":"\"Ah, sweet release. But my people depend on me.\"","cloak":use_cloak,"pepper":"\"ACHOO!\""};

/*var rooms = {"chambers":chambers,
    "chambers_recover":chambers_recover,
    "crypts":crypts,
    "crypts_robert":crypts_robert,
    "start":start,
    "glass_gardens":glass_gardens,
    "hall":hall,
    "godswood":godswood,
    "godswood_south":godswood_south,
    "yard":yard,
    "kitchen":kitchen,
    "hallway":hallway,
    "room_arya":room_arya,
    "north_gate":north_gate,
    "rookery":rookery,
    "room_robert":room_robert
  };
*/

var main = function(room){
    while (global_vars['playing']){
        //launch level
        var room = rooms[room]();
        alert("to the " + room + " room!");
    }
}

global_actions = {
    "onion":"You are not hungry. Besides, you have a feeling you'll need it later.",
    "dirk":"\"Ah, sweet release. But my people depend on me.\"",
    "cloak":use_cloak,
    "pepper":"\"ACHOO!\""
}

var rooms = {"chambers":chambers,"start":start};
main('start');





 
});
