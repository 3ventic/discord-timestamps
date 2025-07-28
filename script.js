const dateInput = document.getElementById("d");
        const timeInput = document.getElementById("hm");
        const typeInput = document.getElementById("t");
        const output = document.getElementById("code");
        const copy = document.getElementById("copy");
        const current = document.getElementById("current");
        const preview = document.getElementById("preview");
        const notification = document.getElementById("copied-notification");

        dateInput.onchange = updateOutput;
        timeInput.onchange = updateOutput;
        typeInput.onchange = updateOutput;
        output.onmouseover = function () {
          this.select();
        };
        // Copy to clipboard
        copy.onclick = async () => {
        updateOutput();
          try {
            await navigator.clipboard.writeText(output.value);
            notification.style.display = "block";
            notification.style.opacity = 1;
            setTimeout(() => {
              notification.style.opacity = 0;
              setTimeout(() => {
                notification.style.display = "none";
              }, 500);
            }, 1000);
          } catch (e) {
            alert(e);
          }
        };

        //Startup
        const onload = (_) => {
          const now = new Date();
          dateInput.value = `${now.getFullYear()}-${(now.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
          timeInput.value = `${now.getHours().toString().padStart(2, "0")}:${now
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          updateOutput();
        };
        window.onload = onload;
        current.onclick = onload;

        const typeFormats = {
          t: { timeStyle: "short" },
          T: { timeStyle: "medium" },
          d: { dateStyle: "short" },
          D: { dateStyle: "long" },
          f: { dateStyle: "long", timeStyle: "short" },
          F: { dateStyle: "full", timeStyle: "short" },
          R: { style: "long", numeric: "auto" },
        };

        function automaticRelativeDifference(d) {
          const diff = -((new Date().getTime() - d.getTime()) / 1000) | 0;
          const absDiff = Math.abs(diff);
          console.log(diff);
          if (absDiff > 86400 * 30 * 10) {
            return {
              duration: Math.round(diff / (86400 * 365)),
              unit: "years",
            };
          }
          if (absDiff > 86400 * 25) {
            return {
              duration: Math.round(diff / (86400 * 30)),
              unit: "months",
            };
          }
          if (absDiff > 3600 * 21) {
            return { duration: Math.round(diff / 86400), unit: "days" };
          }
          if (absDiff > 60 * 44) {
            return { duration: Math.round(diff / 3600), unit: "hours" };
          }
          if (absDiff > 30) {
            return { duration: Math.round(diff / 60), unit: "minutes" };
          }
          return { duration: diff, unit: "seconds" };
        }
        // Last Updated and Output
        function updateOutput() {
          const selectedDate = new Date(
            `${dateInput.value} ${timeInput.value}`
          );
          const ts = selectedDate.getTime().toString();
          output.value = `<t:${ts.substr(0, ts.length - 3)}:${
            typeInput.value
          }>`;

          if (["R"].includes(typeInput.value)) {
            const formatter = new Intl.RelativeTimeFormat(
              navigator.language || "en",
              typeFormats[typeInput.value] || {}
            );
            const format = automaticRelativeDifference(selectedDate);
            preview.textContent =
              "Last Updated: " + formatter.format(format.duration, format.unit);
          } else {
            const formatter = new Intl.DateTimeFormat(
              navigator.language || "en",
              typeFormats[typeInput.value] || {}
            );
            preview.textContent = formatter.format(selectedDate);
          }
        }