<template>
  <div class="min-h-screen flex items-center justify-center p-4"
    style="background:radial-gradient(ellipse at 30% 50%, rgba(124,92,191,0.06) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.05) 0%, transparent 50%), var(--obsidian)">
    <div class="w-full max-w-[460px]">
      <!-- Logo -->
      <router-link to="/" class="block text-center mb-8 no-underline">
        <div style="font-family:'Playfair Display',serif;font-size:30px;color:var(--gold);font-weight:700">✦ لوكس ستور</div>
        <div style="font-size:12px;color:var(--text-muted);letter-spacing:3px;margin-top:4px">LUXURY STORE</div>
      </router-link>
      <router-view />
    </div>
  </div>
</template>
