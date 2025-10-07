<template>
  <div>
    <v-card flat>
      <v-container>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="12">
              <v-alert dense text outlined color="info" icon="mdi-arrow-down-bold" class="text-center"><b>REPORTE</b>
              </v-alert>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field label="Ingresa la fecha inicial" type="date" outlined dense></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field label="Ingresa la fecha final" type="date" outlined dense></v-text-field>
            </v-col>
            <v-col>
              <v-card-actions>
                <v-btn color="orange" small dark>Descargar</v-btn>
              </v-card-actions>
            </v-col>
          </v-row>
        </v-card-text>
      </v-container>
    </v-card>
  </div>
</template>

<script>

export default {

}
</script>
