<template>
  <div class="contenedor-imagen-inicio">
    <img
      src="/images/menu_inicio/large-IMAGEN-INICIAL-.png"
      alt="Imagen de inicio"
      class="imagen-inicio"
    />
  </div>
</template>

<style scoped>
.contenedor-imagen-inicio {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.imagen-inicio {
  width: 100%;
  height: 100%;
  object-fit: cover; /* llena la pantalla sin deformarse */
  object-position: center;
}
</style>
