# Shujaah Masood Portfolio (static, no backend)

Plain HTML/CSS/JS. Dark/light mode, animations, filterable projects, working contact form.

## Structure
index.html | css/style.css | js/main.js | js/config.js | assets/images/ | netlify.toml | .env.example

## Deploy to Netlify
1. Go to app.netlify.com > Add new site > Deploy manually, drag the unzipped folder in. (Or push to GitHub and import.)
2. Contact form: Netlify detects it automatically. Open Site > Forms > Settings & notifications > Add email notification and enter aries3672@gmail.com.
3. Test by sending a message on the live site (forms do not work from a local file).

## Use Formspree instead
Create a form at formspree.io, copy its endpoint into js/config.js. The endpoint is public by design, no secret is exposed.

## Edit content
- Replace GitHub "Live Demo" links with real URLs in index.html (search "Live Demo").
- Replace the three testimonial placeholders with real ones.
- Change colours at the top of css/style.css (:root variables).
