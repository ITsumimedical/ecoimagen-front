<template>
  <v-card>
    <v-tabs next-icon="mdi-arrow-right" prev-icon="mdi-arrow-left" show-arrows>
      <v-tab>
        permisos
        <v-icon left>
          mdi-hand-back-right-off
        </v-icon>
      </v-tab>
      <v-tab>
        Asignar Permiso
        <v-icon left>
          mdi-gesture-double-tap
        </v-icon>
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <permisos />
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <usuarios />
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-card>
</template>

<script>
import permisos from '@/pages/desarrollo/permiso.vue';
import usuarios from '@/pages/admin/usuarios.vue';


export default {

  components: {
    permisos,
    usuarios
  },

  data() {
    return {

    }
  }
}
</script>

