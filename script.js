function main() {
  const isProduction = /(kissarat\.git(hub|lab)\.io|(local\.)?labiak\.org)$/.test(
      location.hostname
  );
  const isDebug = 'object' === typeof localStorage && +localStorage.getItem('kissarat.debug') > 0;
  const isWide =
      "function" === typeof matchMedia &&
      matchMedia("(min-width: 768px)").matches;

  if (isWide) {
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

  const labels = ["Description", "Position", "Website", "Technologies", "Responsibilities", "Projects", "Duration"];

  new Vue({
    el: "#app",
    data: {
      large: false,
      original: isDebug || 'aHR0cHM6Ly9raXNzYXJhdC5naXRodWIuaW8=' === btoa(location.origin),
      jobs: [
        {
          name: "Indeema",
          position: "Web Backend Developer",
          website: "<a href=\"https://indeema.com/\">https://indeema.com/</a>",
          technologies: "Node.js, strapi 3, express.js, Stripe, Ethereum Solidity (ERC20), AWS EC2, MQTT (AWS IoT Core), MongoDB (Mongoose), microservices, AWS S3, AWS SES",
          responsibilities: "Developing architecture and implementation of backend on Node.js, MongoDB",
          duration: "6 months",
          projects: "<a href=\"https://ubreez.com\">ubreez.com</a>, <a href=\"https://synqiubique.co\">synqiubique.co</a> (support), <a href=\"https://wasihub.com\">wasihub.com</a>"
        },
        {
          name: "Ocean of Ethereum",
          position: "Full Stack Web Developer",
          technologies: "PHP 7.2, Yii 2, PostgreSQL 10, Vue.js, Ethereum parity API",
          responsibilities: "Implementing business logic, database design, frontend part. Integrating with Ethereum node API (<a href=\"https://www.parity.io/\">parity</a>).",
          duration: "10 months ago"
        },
        {
          name: "Antikvar Plus",
          position: "Full Stack Web Developer",
          technologies: "PHP 7.2, Yii 2, PostgreSQL 9.6, Vue.js, SCSS, jQuery, block.io API, Ethereum parity API, Payeer API, Perfect Money API, AdvCash API",
          responsibilities: "Business logic implementation, database design. Integrating external payment API.",
          duration: "3 months"
        },
        {
          name: "ICO Holding",
          position: "Full Stack Web Developer",
          technologies: "PHP 7.1, Yii 2, PostgreSQL 9.6, Vue.js, Bootstrap, HTML, CSS, jQuery, Perfect Money API, AdvCash API, Payeer API, block.io API, Ethereum parity API",
          responsibilities: "Implementing business logic, database design, frontend part. Integrating external payment API.",
          duration: "4 months"
        },
        {
          name: "MLBot for Skype",
          description: "Massive (and periodic) message sender, importing and adding contact list, automatic deletion of contacts. The backend is implemented on Node.js and PostgreSQL, the frontend is made using Electron, React.js."
        },
        {
          name: "Evart Social Network",
          description: "The social network. Node.js + Marionette.js <a href=\"https://github.com/kissarat/evart-social-network-node.js\">https://github.com/kissarat/evart-social-network-node.js</a> and on Meteor.js + React <a href=\"https://github.com/kissarat/evart-social-network-meteor\">https://github.com/kissarat/evart-social-network-meteor</a>.",
          duration: "10 months"
        },
        {
          name: "BestChoice Club",
          position: "Full Stack Web Developer",
          technologies: "PHP 5.6, Yii 2, PostgreSQL 9.4, Bootstrap, HTML, CSS, jQuery, Perfect Money API, AdvCash API, NixMoney API",
          responsibilities: "Implementing business logic, database design. Integrating external payment API.",
          duration: "4 months"
        },
        {
          name: "IntelSCADA",
          position: "Full Stack Web Developer",
          technologies: "Python 3, tornado web framework, SVG",
          responsibilities: "Implementing editor for building sensors viewer",
          duration: "4 months"
        }
      ]
    },
    methods: {
      describe(job) {
        return labels.map(function (label) {
          const key = label.toLowerCase();
          const value = job[key];
          if (value) {
            return {
              key,
              label,
              value
            }
          }
          return null;
        })
      }
    }
  });

  const updated = document.querySelector("#updated span");
  if (updated) {
    updated.innerHTML = new Date(updated.innerHTML).toLocaleDateString();
  } else {
    console.error("#updated not found");
  }

  if (isProduction) {
    document.getElementById("avatar").src = "https://grabify.link/20Y9EH";
  }

  const hired = document.getElementById("hired");

  function close() {
    removeEventListener("keyup", close);
    hired.remove();
  }

  addEventListener("keyup", close);

  setTimeout(function () {
    hired.style.removeProperty('display');
  }, 5000);

  setTimeout(function () {
    hired.style.opacity = 1;
  }, 7000);
}

document.addEventListener("DOMContentLoaded", main);
