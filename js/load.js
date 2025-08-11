var links = [
  "https://discord.com/channels/1235103752369995796/1255782068529401897",
  "https://discord.com/channels/1235103752369995796/1336590129338388511",
  "https://discord.com/channels/1235103752369995796/1287216973620449340",
  "https://discord.com/channels/1235103752369995796/1235103752369995799",
  "https://discord.com/channels/1235103752369995796/1284176003698003968",
]

const initConfig = {
  mode: "fixed",
  hidden: true,
  content: {
    link: links[Math.floor(Math.random() * links.length)],
    welcome: ["Welcome hacker!"],
    touch: "",
    skin: ["Would you like to meet my sister?", "I have a good friend Luna!"],
    custom: [
      { "selector": ".comment-form", "text": "Content Tooltip" },
      { "selector": ".home-social a:last-child", "text": "Blog Tooltip" },
      { "selector": ".list .postname", "type": "read" },
      { "selector": ".post-content a, .page-content a, .post a", "type": "link" }
    ],
  },
  night: "toggleNightMode()",
  model: [
    "/wp-content/themes/sakura/live2d/Diana/Diana.model3.json",
    "/wp-content/themes/sakura/live2d/Ava/Ava.model3.json",
  ],
  tips: true,
  onModelLoad: onModelLoad
}

function load_idol() {
  pio_reference = new Paul_Pio(initConfig)
  pio_alignment = "left"
  pio_refresh_style()
}

function onModelLoad(model) {
  const container = document.getElementById("pio-container")
  const canvas = document.getElementById("pio")
  const modelNmae = model.internalModel.settings.name
  const coreModel = model.internalModel.coreModel
  const motionManager = model.internalModel.motionManager

  let touchList = [
    {
      text: "Hiya Heyo ♬♪♫\nDo ya know my master Axura?",
      motion: "Idle"
    },
    {
      text: "I can't spill the beans, but my master tucked the secret away in the Labyrinth!",
      motion: "Idle"
    },
    {
      text: "zzZ...",
      motion: "Tap_sleep"
    }
  ]

  function playAction(action) {
    action.text && pio_reference.modules.render(action.text)
    action.motion && pio_reference.model.motion(action.motion)

    if (action.from && action.to) {
      Object.keys(action.from).forEach(id => {
        const hidePartIndex = coreModel._partIds.indexOf(id)
        TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.from[id] });
        // coreModel._partOpacities[hidePartIndex] = action.from[id]
      })

      motionManager.once("motionFinish", (data) => {
        Object.keys(action.to).forEach(id => {
          const hidePartIndex = coreModel._partIds.indexOf(id)
          TweenLite.to(coreModel._partOpacities, 0.6, { [hidePartIndex]: action.to[id] });
          // coreModel._partOpacities[hidePartIndex] = action.to[id]
        })
      })
    }
  }

  canvas.onclick = function () {
    if (motionManager.state.currentGroup !== "Idle") return

    const action = pio_reference.modules.rand(touchList)
    playAction(action)
  }

  if (modelNmae === "Diana") {
    container.dataset.model = "Diana"
    initConfig.content.skin[1] = ["I am super Diana!"]
    playAction({ motion: "Tap_hug_lefthand" })

    touchList = [
      {
        text: "Happy hacking!",
        motion: "Tap_hug_lefthand"
      },
      {
        text: "If an alien gave you 10 seconds to ask one question about the universe, what would you ask?",
        motion: "Tap_left_bowtie"
      },
      {
        text: "Where's the flag?",
        motion: "Tap_cry_eye"
      },
      {
        text: "Am I clever enough to be a hacker?",
        motion: "Tap_shy_forehead"
      },
      {
        text: "Spoiler Alert: No, your car isn’t powered by liquefied dinosaurs.",
        motion: "Tap_hug_lefthand"
      },
      {
        text: "If Elon Musk called you today, what would you say to him?",
        motion: "Tap_shake"
      },
      {
        text: "Bún bò ao sen nay đã tăng giá 35k một bát!",
        motion: "Tap_ear"
      },
      {
        text: "Hello hackers",
        motion: "Tap_Smile_face"
      },
      {
        text: "Choosing two burgers over a burger with fries can actually be the more balanced option",
        motion: "Tap_righthair"
      },
    ]

  } else if (modelNmae === "Ava") {
    container.dataset.model = "Ava"
    initConfig.content.skin[1] = ["I'm Ava. What sup?"]
    playAction({
      motion: "Tap_lefteye",
      from: {
        "Part15": 1
      },
      to: {
        "Part15": 0
      }
    })

    touchList = [
      {
        text: "Jellyfish is just an ordinary creature.",
        motion: "Tap_righthand"
      },
      {
        text: "My heart belongs to Axura.",
        motion: "Tap_bracelace",
        from: {
          "Part12": 1
        },
        to: {
          "Part12": 0
        }
      },
      {
        text: "Well... I mean we can be friends.",
        motion: "Tap_forehead",
        from: {
          "Part12": 1
        },
        to: {
          "Part12": 0
        }
      },
      {
        text: "What happened?",
        motion: "Tap_righteye",
        from: {
          "Part16": 1
        },
        to: {
          "Part16": 0
        }
      },
      {
        text: "Ok... I'm gonna shut up..",
        motion: "Tap_mouth"
      },
      {
        text: "AAAAAAvvvvAAAAAA!",
        motion: "Tap_lefteye",
        from: {
          "Part15": 1
        },
        to: {
          "Part15": 0
        }
      }
    ]
    canvas.width = model.width * 1.2
    const hideParts = [
      "Part5", // dizzy
      "neko", // catty fist
      "game", // game left-handler
      "Part15", // sunglasses
      "Part21", // right-hand arm
      "Part22", // left-hand down
      "Part", // Clenched hands into fists
      "Part16", // suprise effect
      "Part12" // heart love
    ]
    const hidePartsIndex = hideParts.map(id => coreModel._partIds.indexOf(id))
    hidePartsIndex.forEach(idx => {
      coreModel._partOpacities[idx] = 0
    })
  }
}


var pio_reference
window.onload = load_idol
