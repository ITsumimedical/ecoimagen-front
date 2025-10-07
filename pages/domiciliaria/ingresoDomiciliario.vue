<template>
  <v-card class="pa-3 text-body-1" flat>

    <v-row>
      <v-col v-for="emp in empleados" :key="emp.color" cols="12" sm="3" md="3">
        <Widget
          :color="emp.color"
          :icon="emp.icon"
          :title="emp.title"
          :subTitle="emp.subTitle"
          :supTitle="emp.supTitle"
        />
      </v-col>
    </v-row>

    <v-tabs
      v-model="tab"
      background-color="transparent"
      centered
      icons-and-text
    >
      <v-tabs-slider></v-tabs-slider>

      <v-tab href="#tab-1">
        Pendientes
        <v-icon>mdi-account-box</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        En Proceso
        <v-icon>mdi-account-box</v-icon>
      </v-tab>

      <v-tab href="#tab-3">
        Cerrados
        <v-icon>mdi-account-box</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="i in 3" :key="i" :value="'tab-' + i">
        <v-card flat>
          <v-card-text>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Buscar"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="desserts"
              :search="search"
              dense
            ></v-data-table>
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import Widget from "~/components/widget/Widget.vue";
export default {
middleware({
      $can,
      redirect
    }) {
      if (!$can('blog.vista')) {
        return redirect('/');
      }
    },
  components: {
    Widget,
  },
  data() {
    return {
      search: "",
      tab: null,
      empleados: [
        {
          color: "#00b297",
          icon: "mdi-account-multiple-outline",
          title: "0",
          subTitle: "Total Ingresos",
        },
        {
          color: "#cfa33c",
          icon: "mdi-clipboard-text",
          title: "0",
          subTitle: "Solicitudes Pendientes",
        },
        {
          color: "#0074a6",
          icon: "mdi-account-injury-outline",
          title: "0",
          subTitle: "Solicitudes en Proceso",
        },
        {
          color: "#d300009c",
          icon: "mdi-account-off",
          title: "0",
          subTitle: "Solicitudes Cerradas",
        },
      ],
      headers: [
        {
          text: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          value: "name",
        },
        { text: "Calories", value: "calories" },
        { text: "Fat (g)", value: "fat" },
        { text: "Carbs (g)", value: "carbs" },
        { text: "Protein (g)", value: "protein" },
        { text: "Iron (%)", value: "iron" },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1,
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1,
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: 7,
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: 8,
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: 16,
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: 0,
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2,
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: 45,
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: 22,
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: 6,
        },
      ],
    };
  },
};
</script>
