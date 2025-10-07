<template>
  <v-card elevation="0">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>
          <div class="d-flex align-center">
            <img src="/images/ojo.svg" alt="" height="50px" width="50px" />
            <span>Parametrización - PQRSF</span>
          </div>
        </v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
      </v-toolbar>
    </v-card-title>
    <v-card-text>
      <v-tabs
        grow
        next-icon="mdi-arrow-right"
        prev-icon="mdi-arrow-left"
        show-arrows
      >
        <v-tab> Canales </v-tab>
        <v-tab> Tipos de requerimientos </v-tab>
        <v-tab> Derechos </v-tab>
        <v-tab> Subcategorias </v-tab>
        <v-tab> Responsable </v-tab>
        <v-tab> Area Responsable </v-tab>
        <v-tab> Areas </v-tab>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <CanalComponente />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <TipoSolicitudPqrsfComponente />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <DerechosPqrsfComponente />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <subcategorias />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <ResponsablePqrsfComponente />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <AreaResponsablePqrsfComponente />
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <v-card-text>
              <AreaComponente />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import CanalComponente from "~/components/gestionPqrsf/CanalComponente.vue";
import TipoSolicitudPqrsfComponente from "~/components/gestionPqrsf/TipoSolicitudPqrsfComponente.vue";
import subcategorias from "@/pages/subcategorias/subcategorias.vue";
import ResponsablePqrsfComponente from "~/components/gestionPqrsf/ResponsablePqrsfComponente.vue";
import AreaResponsablePqrsfComponente from "~/components/gestionPqrsf/AreaResponsablePqrsfComponente.vue";
import AreaComponente from "~/components/gestionPqrsf/AreaComponente.vue";
import DerechosPqrsfComponente from "~/components/gestionPqrsf/DerechosPqrsfComponente.vue";

export default {
  middleware({ $can, redirect }) {
    if (!$can("pqrsf.menu")) {
      return redirect("/");
    }
  },
  name: "WorkspaceJsonParametrizacion",

  components: {
    CanalComponente,
    TipoSolicitudPqrsfComponente,
    subcategorias,
    ResponsablePqrsfComponente,
    AreaResponsablePqrsfComponente,
    AreaComponente,
    DerechosPqrsfComponente,
  },

  data() {
    return {};
  },
};
</script>
