<template>
  <div>
    <v-row>
      <v-col
        v-for="tele in teleapoyos"
        :key="tele.color"
        cols="12"
        sm="4"
        md="4"
      >
        <Widget
          :color="tele.color"
          :icon="tele.icon"
          :title="tele.title"
          :subTitle="tele.subTitle"
          :supTitle="tele.supTitle"
        />
      </v-col>
      <v-col cols="12" sm="12" md="12">
        <v-card>
          <v-alert dense text outlined color="info" class="text-center"
            >Descargar reporte
          </v-alert>

          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="fecha.fecha_inicial"
                  dense
                  label="Fecha inicial"
                  type="date"
                >
                </v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="fecha.fecha_final"
                  dense
                  label="Fecha inicial"
                  type="date"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-spacer> </v-spacer>
              <v-col cols="2" sm="2" md="1">
                <v-btn small @click="reporte()" dark color="info"
                  >Descargar</v-btn
                >
              </v-col>
            </v-card-actions>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  middleware({ $can, redirect }) {
    if (!$can("telesalud.reporte")) {
      return redirect("/");
    }
  },
  name: "WorkspaceJsonReporte",

  data() {
    return {
      fecha: {
        fecha_inicial: "",
        fecha_final: "",
      },
      teleapoyos: [
        {
          color: "#00b297",
          icon: "mdi-update",
          title: "0",
          subTitle: "Total ingresados",
        },
        {
          color: "#0074a6",
          icon: "mdi-checkbox-marked-circle-outline",
          title: "0",
          subTitle: "Solucionados",
        },
        {
          color: "#E53935",
          icon: "mdi-alert-circle-outline",
          title: "0",
          subTitle: "Pendientes",
        },
      ],
    };
  },

  mounted() {
    this.contador();
  },

  methods: {
    contador() {
      this.$axios.get("teleapoyo/contador").then((res) => {
        this.teleapoyos[0].title = res.data.total.toString();
        this.teleapoyos[1].title = res.data.solucionados.toString();
        this.teleapoyos[2].title = res.data.pendientes.toString();
      });
    },

    reporte() {
      this.$axios({
        method: "post",
        params: {
          fecha_inicial: this.fecha.fecha_inicial,
          fecha_final: this.fecha.fecha_final,
        },
        url: "/teleapoyo/reporte",
        responseType: "blob",
      })
        .then((res) => {
          let blob = new Blob([res.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
          });
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");

          a.download = "InformeTeleapoyo.xlsx";
          a.href = url;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          this.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
