# Utsav Sadhana

Festival-by-festival sadhana for the home: what to do each day, the texts to recite, and a mala counter. It covers ten observances: Ganeshotsav, Sankashti Chaturthi, Sharad Navratri, Diwali, Makar Sankranti, Vasant Panchami, Maha Shivaratri, Chaitra Navratri and Ram Navami, Hanuman Jayanti and Janmashtami.

- **Ganeshotsav 2027** (4–14 September, Pune): choose 1½, 5, 7 or 11 days and a daily japa target. Each day has a checklist (dhyana, puja with 21 durva and the 21 names, Atharvashirsha, japa, Sankatanashana stotram, naivedya, aarti), a focus (days 2–9 follow the Ashtavinayak), the sthapana muhurat and the moon-sighting times with the Syamantaka remedy shloka.
- **Sankashti Chaturthi**: the next dates with Pune moonrise.
- **Navratri 2026** (11–20 Oct): a form of the Devi each day, kanya puja on Ashtami-Navami, Dussehra. **Diwali 2026** (6–11 Nov): Dhanteras to Bhai Dooj. **2027**: Sankranti, Vasant Panchami, Shivaratri (four prahar), Chaitra Navratri with the daily Ramaraksha, Hanuman Jayanti with the Chalisa, Janmashtami and Dahi Handi.
- **Mantras by deity**: Ganesha, Shiva, Vishnu, Krishna, Rama, Hanuman, Durga, Lakshmi, Saraswati and Surya, each with its source, meaning and usual count.
- **Mala counter**: 108 beads, keeps the screen on, vibrates on phones that support it.
- Devanagari, IAST or both. Light and dark themes. Progress is kept in the browser (and in your account when opened on claude.ai).

Open `index.html`, or visit the GitHub Pages site.

## Sources

- Ganapati Atharvashirsha, Sankatanashana Ganesha Stotram, the Mahaganapati 21 names, Ramaraksha Stotram and Hanuman Chalisa: [sanskritdocuments.org](https://sanskritdocuments.org) (volunteer-prepared, for personal study; please keep the credit). Copies are in `sources/`.
- Sukhakarta Dukhaharta (Samarth Ramdas): English and Marathi Wikipedia, checked against each other.
- Short mantras: hand-entered and checked against the primary texts (Rigveda, Devi Mahatmya, Ramaraksha, Bhagavata, Kali-santarana Upanishad and others); each shows its citation in the app.
- Festival dates, muhurat and moonrise: [Drik Panchang](https://www.drikpanchang.com), for Pune, checked 16 Oct 2026.

## Building

```sh
node tools/build.mjs     # writes index.html and build/artifact.html
node tests/smoke.mjs     # headless walk-through (needs Playwright)
```

`src/content.js` holds festivals and mantras as data; a new festival is a new entry. IAST comes from the Devanagari via the converter shared with [Stotra Reader](https://github.com/tiwari91/stotra-reader).

## License

Code under the [MIT License](LICENSE). The texts are traditional works, transcribed by their credited sources.
