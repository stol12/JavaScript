import './style.css'
import { getWeather } from "../weather";
import axios from "axios";
import { ICON_MAP } from './iconmap';

navigator.geolocation.getCurrentPosition(positionSuccess, positionFailure);

function positionSuccess({ coords }) {
  getWeather(coords.latitude, coords.longitude, Intl.DateTimeFormat().resolvedOptions().timeZone).then(renderWeather)
  .catch(e => {
    console.log(e);
  });
}

function positionFailure() {
  alert("There was an error getting your location. Please allow us to use your location and refresh the page");
}

function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily);
  renderHourlyWeather(hourly);
  document.body.classList.remove("blurred");
}

function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector("[data-current-icon]");

function renderCurrentWeather(current){
  currentIcon.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("current-high", current.highTemp);
  setValue("current-low", current.lowTemp);
  setValue("current-fl-high", current.highFeelsLike);
  setValue("current-fl-low", current.lowFeelLike);
  setValue("current-wind", current.windSpeed);
  setValue("current-percip", current.precip);
}

const DAY_FORMATTER =  new Intl.DateTimeFormat(undefined, { weekday: "long" });
const dailySection = document.querySelector("[data-day-section]");
const dailyCardTemplate = document.getElementById("day-card-template");

function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach(day => {
    console.log(day);
    const element = dailyCardTemplate.content.cloneNode(true);
    setValue("temp", day.maxTemp, { parent: element });
    setValue("date", DAY_FORMATTER.format(day.timestamp), { parent: element });
    element.querySelector("[data-icon").src = getIconUrl(day.iconCode);
    dailySection.append(element);
  })
}


const HOUR_FORMATTER =  new Intl.DateTimeFormat(undefined, { hour: "numeric" });
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");

function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";
  hourly.forEach(hour => {
    //console.log(day);
    const element = hourRowTemplate.content.cloneNode(true);
    setValue("temp", hour.maxTemp, { parent: element });
    setValue("fl-temp", hour.feelsLike, { parent: element });
    setValue("wind", hour.windSpeed, { parent: element });
    setValue("precip", hour.percip, { parent: element });
    setValue("day", hour.feelsLike, { parent: element });
    setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: element });
    setValue("time", HOUR_FORMATTER.format(hour.timestamp), { parent: element });
    element.querySelector("[data-icon").src = getIconUrl(hour.iconCode);
    hourlySection.append(element);
  })
}