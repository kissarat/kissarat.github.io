/**
 * This script is also my spaghetti-code example :)
 */

const jobs = [
  {
    name: notforbot('UGFydE92ZXI='),
    position: "Full-Stack Developer",
    technologies: "Node.js, MySQL, RabbitMQ, ElasticSearch, React/Redux, Nest.js, Swagger 3, Meteor, knex, yup, lodash, Docker Compose",
    duration: "1 year"
  },
  {
    name: notforbot('TGlrZSBDYXJnbw=='),
    position: "Node.js Backend Developer, casually Tech Lead",
    technologies: "Node.js 14, Express.js, Google Maps API, MongoDB 4.3, RabbitMQ, AWS EC2, AWS CloudWatch, Cloudinary, OneSignal, Twilio",
    duration: "6 months"
  },
  {
    name: notforbot('U3RlbGxhclNvbHZlcnM='),
    position: "Node.js Backend Developer",
    technologies:
      "Nest.js, Koa.js, Sequelize, TypeORM, PostgreSQL, Redis, Jenkins, Docker, AWS S3, AWS CloudWatch",
    duration: "1 year",
    projects: "Survey API, User Management, Prizmar",
  },
  {
    name: notforbot("VUtFRVNT"),
    position: "Full Stack Web Developer",
    technologies:
      "React 16, Redux, Saga, express.js, immutable.js, jest, enzyme, Terraform, Jenkins, AWS",
    duration: "10 months",
    projects: "Confidential",
  },
  {
    name: notforbot("SW5kZWVtYQ=="),
    position: "Web Backend Developer",
    website: anchorList("aW5kZWVtYS5jb20="),
    technologies:
      "Node.js, strapi 3, express.js, Stripe, Ethereum Solidity (ERC20), AWS EC2, MQTT (AWS IoT Core), MongoDB (Mongoose), microservices, AWS S3, AWS SES",
    responsibilities:
      "Developing architecture and implementation of backend on Node.js, MongoDB",
    duration: "5 months",
    projects: anchorList(
      "dWJyZWV6LmNvbSBzeW5xaXViaXF1ZS5jbyB3YXNpaHViLmNvbQ=="
    ),
  },
  {
    name: notforbot("T2NlYW4gb2YgRXRoZXJldW0="),
    position: "Full Stack Web Developer",
    technologies:
      "PHP 7.2, Yii 2, PostgreSQL 10, Vue.js, Ethereum parity API",
    responsibilities:
      'Implementing business logic, database design, frontend part. Integrating with Ethereum node API (<a href="https://www.parity.io/">parity</a>).',
    duration: "10 months",
    type: 'financial'
  },
  {
    name: "Antikvar Plus",
    position: "Full Stack Web Developer",
    technologies:
      "PHP 7.2, Yii 2, PostgreSQL 9.6, Vue.js, SCSS, jQuery, block.io API, Ethereum parity API, Payeer API, Perfect Money API, AdvCash API",
    responsibilities:
      "Business logic implementation, database design. Integrating external payment API.",
    duration: "6 months",
    type: 'financial'
  },
  {
    name: "ICO Holding",
    position: "Full Stack Web Developer",
    technologies:
      "PHP 7.1, Yii 2, PostgreSQL 9.6, Vue.js, Bootstrap, HTML, CSS, jQuery, Perfect Money API, AdvCash API, Payeer API, block.io API, Ethereum parity API",
    responsibilities:
      "Implementing business logic, database design, frontend part. Integrating external payment API.",
    duration: "11 months",
    type: 'financial'
  },
  {
    name: "MLBot for Skype",
    description:
      "Massive (and periodic) message sender, importing and adding contact list, automatic deletion of contacts. The backend is implemented on Node.js and PostgreSQL, the frontend is made using Electron, React.js.",
    duration: "1 year",
  },
  {
    name: "Evart Social Network",
    description:
      'The social network. Node.js + Marionette.js <a href="https://github.com/kissarat/evart-social-network-node.js">https://github.com/kissarat/evart-social-network-node.js</a> and on Meteor.js + React <a href="https://github.com/kissarat/evart-social-network-meteor">https://github.com/kissarat/evart-social-network-meteor</a>.',
    duration: "10 months",
    type: 'financial'
  },
  {
    name: "BestChoice Club",
    position: "Full Stack Web Developer",
    technologies:
      "PHP 5.6, Yii 2, PostgreSQL 9.4, Bootstrap, HTML, CSS, jQuery, Perfect Money API, AdvCash API, NixMoney API",
    responsibilities:
      "Implementing business logic, database design. Integrating external payment API.",
    duration: "1 year 5 months",
    type: 'financial'
  },
  {
    name: "IntelSCADA",
    position: "Full Stack Web Developer",
    technologies: "Python 3, tornado web framework, SVG",
    responsibilities: "Implementing editor for building sensors viewer",
    duration: "4 months",
  },
]

function loadExperience() {
  const labels = [
    "Description",
    "Position",
    "Website",
    "Technologies",
    "Responsibilities",
    "Projects",
    "Duration",
    "Since",
  ];

  // Email
  const email = notforbot("dGFyYXMubGFiaWFrQG91dGxvb2suY29t");
  const emailElement = document.querySelector("[itemprop=email]");
  emailElement.setAttribute("href", "mailto:" + email);
  emailElement.innerHTML = email;
  const original = isDebug || notforbot("aHR0cHM6Ly9raXNzYXJhdC5naXRodWIuaW8=") === location.origin

  // Experience
  const app = createApp({
    data: () => ({
      large: false,
      original: true,
    }),
    computed: {
      jobs() {
        const jobInfos = jobs.map(job => ({
          ...job,
          classes: {
            item: true, [job.type || 'normal']: true
          },
          isConfidential: job.name === 'Confidential' || job.name === 'Hidden',
          properties: labels
            .map(function (label) {
              const key = label.toLowerCase();
              const value = job[key];
              if (!value) {
                // throw new Error(`Label ${key} not available`)
                return null
              }
              return {
                isPlainText: value.indexOf('<') < 0,
                classes: {
                  [`property-${key}`]: true
                },
                key,
                label,
                value,
              };
            })
            .filter(property => null !== property)
        }));
        trace(jobInfos)
        return jobInfos;
      }
    },
  });
  app.mount("#app")
}

// Internationalization
function loadLocalization() {
  // Detecting support of Russian language
  let language =
    navigator.languages &&
      (navigator.language || "").split("-")[0] !== "en" &&
      navigator.languages.length > 0 &&
      navigator.languages.indexOf("ru") >= 0
      ? "ru"
      : "en";
  const languageSetting = localStorage.getItem("language") || "";
  if (["ru", "en"].indexOf(languageSetting) >= 0) {
    language = languageSetting;
  }

  if ("ru" === language) {
    fetchJSON("/i18n/ru.json").then(function (json) {
      for (const selector in json) {
        const elements = document.querySelectorAll(selector);
        const object = json[selector];
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          if ("string" === typeof object) {
            element.innerHTML = object;
          } else {
            for (const name in object) {
              const translation = object[name];
              if (["value"].indexOf(name) >= 0) {
                element[name] = translation;
              } else {
                element.setAttribute(name, translation);
              }
            }
          }
        }
        if (elements.length !== 1) {
          console.warn(
            "Selector '" +
            selector +
            "' found " +
            elements.length +
            ' times for "ru"'
          );
        }
      }
    });

    const english = document.querySelector(".english");
    english.addEventListener("click", function () {
      localStorage.setItem("language", "en");
      location.reload();
    });
    english.style.removeProperty("display");
  }

  // Images in page background
  const logos = [
    "angular.png",
    "aws.png",
    "bitcoin.png",
    "docker.jpg",
    "electron.png",
    "freebsd.svg",
    "git.png",
    "google-app-engine.jpg",
    "google-cloud.jpg",
    "html.png",
    "intellij.jpg",
    "java.png",
    "jenkins.jpg",
    "js.png",
    "koa.gif",
    "linux.png",
    "meteor.png",
    "mongodb.png",
    "mysql.png",
    "nestjs.svg",
    "net.png",
    "nginx.png",
    "nodejs.svg",
    "opencv.png",
    "php.png",
    "postgresql.png",
    "python.png",
    "react.png",
    "redis.png",
    "ruby-on-rails.png",
    "silverlight.png",
    "solidity.png",
    "svg.png",
    "terraform.png",
    "typeorm.png",
    "ubuntu.png",
    "vscode.png",
    "vue.png",
    "webpack.png",
    "webrtc.png",
    "yii.jpg",
  ]
    .sort(() => Math.random() > 0.5 ? 1 : -1);

  const skillsEl = document.querySelector('#skill-logos > div');
  logos.forEach(function (logo) {
    const img = document.createElement('img');
    img.classList.add('logo');
    img.src = '/skills/' + logo;
    skillsEl.appendChild(img);
  })
}

// Entrypoint
function main() {
  const isWideScreen =
    "function" === typeof matchMedia
      ? matchMedia("(min-width: 768px)").matches
      : innerWidth >= 768;

  if (isWideScreen) {
    [].forEach.call(document.querySelectorAll("a"), function (a) {
      // if (/https:\/\/[\w.]*wikipedia\.org/.test(a.href)) {
      //   a.setAttribute('data-href', a.href)
      //   a.removeAttribute('href')
      //   a.addEventListener('click', function (e) {
      //     e.preventDefault()
      //     return false
      //   })
      // }
      // else {
      a.setAttribute("target", "_blank");
      // }
    });
  }

  const updated = document.querySelector("#updated span");
  if (updated) {
    updated.innerHTML = new Date(updated.innerHTML).toLocaleDateString();
  } else {
    throw new Error("#updated not found");
  }

  loadExperience();
  loadLocalization();
}

entrypoint(
  [
    LabiakLibrary.Vue,
    LabiakLibrary.Moment
  ],
  main
)
