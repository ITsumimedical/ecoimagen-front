<template>
  <v-container fluid>
    <div max-width="550px" class="mx-auto bg">
      <v-img height="310px" src="/images/victoriana.png"></v-img>
        <br>
        <br>
      <v-row justify="center">
        <v-col
          align-self="start"
          class="d-flex justify-center align-center pa-0"
          cols="12"
        >
          <v-avatar
            class="profile avatar-center-heigth avatar-shadow"
            color="grey"
            size="164"
          >
            <v-img
              src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
            ></v-img>
          </v-avatar>
        </v-col>
      </v-row>
      <br>
      <v-card-text>
        <v-row justify="center">
          <v-card-title v-if="datos.sn_user_recibe != null"
            >{{ datos.pn_user_recibe }} {{ datos.sn_user_recibe }}
            {{ datos.pa_user_recibe }}
            {{ datos.sa_user_recibe }}</v-card-title
          >
          <v-card-title v-else
            >{{ datos.pn_user_recibe }} {{ datos.pa_user_recibe }}
            {{ datos.sa_user_recibe }}</v-card-title
          >
        </v-row>
        <div class="text-subtitle-2 text-center">
          <v-icon small>mdi-briefcase</v-icon> {{ datos.cargo_user_recibe }}
        </div>
        <div class="text-subtitle text-center">
          <v-icon small>mdi-city</v-icon> {{ datos.area_user_recibe }}
        </div>
        <div
          v-if="datos.email_user_recibe != null"
          class="text-subtitle text-center"
        >
          <v-icon small>mdi-gmail</v-icon> {{ datos.email_user_recibe }}
        </div>
        <div v-else class="text-subtitle text-center">
          <v-icon small>mdi-gmail</v-icon> Sin correo asginado
        </div>
        <div class="text-subtitle text-center">
          <v-icon small>mdi-map-marker</v-icon> {{ datos.sede_user_recibe }}
        </div>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
      </v-card-text>
    </div>
  </v-container>
</template>

<script>
export default {
  middleware({ $can, redirect }) {
    if (!$can("blog.vista")) {
      return redirect("/");
    }
  },
  name: "informacion-empleado",

  props: {
    datos: null,
  },

  // watch: {
  //   datos() {
  //     if (this.datos.mensajes) {
  //       this.filtroAdjuntos();
  //     }
  //   },
  // },

  data() {
    return {
      messages: [],
    };
  },

  mounted() {
  },

  computed: {

  },

  methods: {},
};
</script>

<style scoped>
.bg {
  background: rgb(255, 197, 185);
  background: linear-gradient(
    0deg,
    rgba(214, 226, 238, 0.649) 0%,
    rgba(231, 240, 249, 0.856) 35%,
    rgba(255, 255, 255, 0.867) 64%
  );
}

.avatar-shadow {
  box-shadow: 0px 0px 10px 0px rgba(50, 12, 112, 0.75);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(50, 12, 112, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(50, 12, 112, 0.75);
}
</style>
