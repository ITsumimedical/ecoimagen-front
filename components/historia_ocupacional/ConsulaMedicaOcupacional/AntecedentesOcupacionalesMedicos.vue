<template>
  <v-container grid-list-md fluid class="pa-0">
    <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">ANTECEDENTES
      OCUPACIONALES</v-alert>
    <v-layout row wrap>
      <v-col cols="12" sm="6">
        <v-text-field label="Empresa" v-model="antecedenteOcupacional.antecedente_empresa">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field label="Cargo" v-model="antecedenteOcupacional.antecedente_cargo">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="F" v-model="antecedenteOcupacional.f">
        </v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="Q" v-model="antecedenteOcupacional.q">
        </v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="B" v-model="antecedenteOcupacional.b">
        </v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="Erg" v-model="antecedenteOcupacional.erg"></v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="Psic" v-model="antecedenteOcupacional.psic"></v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="Mec" v-model="antecedenteOcupacional.mec"></v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="Elec" v-model="antecedenteOcupacional.elec"></v-select>
      </v-col>
      <v-col cols="12" sm="1">
        <v-select :items="['x', '']" label="Otro" v-model="antecedenteOcupacional.otro"></v-select>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="Tiempo" v-model="antecedenteOcupacional.tiempo">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <v-text-field label="Uso E.P.P" v-model="antecedenteOcupacional.uso_e_p_p">
        </v-text-field>
      </v-col>
      <v-col cols="12" sm="12">
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">HA SUFRIDO
          ACCIDENTES DE TRABAJO?</v-alert>
      </v-col>
      <v-layout row wrap>
        <v-col cols="12" sm="3">
          <v-text-field label="Fecha" type="date" v-model="antecedenteOcupacional.fecha_accidentes">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field label="Empresa" v-model="antecedenteOcupacional.empresa_accidentes">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field label="Causa" v-model="antecedenteOcupacional.causa">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field label="Tipo de lesion" v-model="antecedenteOcupacional.tipo_lesion">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field label="Parte afectada" v-model="antecedenteOcupacional.parte_afectada">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field label="Días de incapacidad" v-model="antecedenteOcupacional.dias_incap">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field label="Secuelas" v-model="antecedenteOcupacional.secuelas">
          </v-text-field>
        </v-col>
      </v-layout>
      <v-col cols="12" sm="12">
        <v-alert class="text-center" dense text outlined type="info" icon="mdi-checkbox-multiple-marked">HA SUFRIDO
          ENFERMEDADES PROFESIONALES?</v-alert>
      </v-col>

      <v-layout row wrap>
        <v-col cols="12" sm="4">
          <v-text-field label="Fecha" type="date" v-model="antecedenteOcupacional.fecha">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field label="Empresa" v-model="antecedenteOcupacional.empresa">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field label="Diagnostico" v-model="antecedenteOcupacional.diagnostico">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field label="Reubicacion" v-model="antecedenteOcupacional.reubicacion">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field label="Indemnización" v-model="antecedenteOcupacional.indemnizacion">
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="12">
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="success" dark small @click="saveAntecedentesOpucacionales()">Guardar</v-btn>
          </v-card-actions>
        </v-col>
      </v-layout>

      <v-data-table :headers="headers" :items="antOcupacional" class="elevation-1">
        <template v-slot:items="props">
          <td>{{ props.item.antecedente_empresa}}</td>
          <td class="text-xs-right">{{ props.item.antecedente_cargo}}</td>
          <td class="text-xs-right">{{ props.item.f }}</td>
          <td class="text-xs-right">{{ props.item.q }}</td>
          <td class="text-xs-right">{{ props.item.b }}</td>
          <td class="text-xs-right">{{ props.item.erg }}</td>
          <td class="text-xs-right">{{ props.item.psic }}</td>
          <td class="text-xs-right">{{ props.item.mec }}</td>
          <td class="text-xs-right">{{ props.item.elec }}</td>
          <td class="text-xs-right">{{ props.item.otro }}</td>
          <td class="text-xs-right">{{ props.item.tiempo }}</td>
          <td class="text-xs-right">{{ props.item.uso_e_p_p }}</td>
          <td class="text-xs-right">{{ props.item.accidentes_trabajo }}</td>
          <td class="text-xs-right">{{ props.item.fecha_accidentes }}</td>
          <td class="text-xs-right">{{ props.item.empresa_accidentes }}</td>
          <td class="text-xs-right">{{ props.item.causa }}</td>
          <td class="text-xs-right">{{ props.item.tipo_lesion }}</td>
          <td class="text-xs-right">{{ props.item.parte_afectada }}</td>
          <td class="text-xs-right">{{ props.item.dias_incap }}</td>
          <td class="text-xs-right">{{ props.item.secuelas }}</td>
          <td class="text-xs-right">{{ props.item.enfermedades_profesionales }}</td>
          <td class="text-xs-right">{{ props.item.fecha }}</td>
          <td class="text-xs-right">{{ props.item.empresa }}</td>
          <td class="text-xs-right">{{ props.item.diagnostico }}</td>
          <td class="text-xs-right">{{ props.item.reubicacion }}</td>
          <td class="text-xs-right">{{ props.item.indemnizacion }}</td>
        </template>
        <template v-slot:pageText="props">
          Lignes {{ props.pageStart }} - {{ props.pageStop }} de {{ props.itemsLength }}
        </template>
      </v-data-table>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    name: "",
    props: {
      datosCita: Object,
      ocupacional: Array,
      tipoConsultaOcupacional: Object
    },
    created() {
      // this.fetchAntecedentesOpucacionales()
    },
    data() {
      return {
        headers: [{
            text: 'empresa',
            value: 'antecedente_empresa'
          }, {
            text: 'antecedente_cargo',
            value: 'antecedente_cargo'
          },
          {
            text: 'f',
            value: 'f'
          },
          {
            text: 'q',
            value: 'q'
          },
          {
            text: 'b',
            value: 'b'
          },
          {
            text: 'erg',
            value: 'erg'
          },
          {
            text: 'psic',
            value: 'psic'
          },
          {
            text: 'mec',
            value: 'mec'
          },
          {
            text: 'elec',
            value: 'elec'
          },
          {
            text: 'otro',
            value: 'otro'
          },
          {
            text: 'tiempo',
            value: 'tiempo'
          },
          {
            text: 'uso_e_p_p',
            value: 'uso_e_p_p'
          },
          {
            text: 'accidentes_trabajo',
            value: 'accidentes_trabajo'
          },
          {
            text: 'fecha_accidentes',
            value: 'fecha_accidentes'
          },
          {
            text: 'empresa_accidentes',
            value: 'empresa_accidentes'
          },
          {
            text: 'causa',
            value: 'causa'
          },
          {
            text: 'tipo_lesion',
            value: 'tipo_lesion'
          },
          {
            text: 'parte_afectada',
            value: 'parte_afectada'
          },
          {
            text: 'dias_incap',
            value: 'dias_incap'
          },
          {
            text: 'secuelas',
            value: 'secuelas'
          },
          {
            text: 'enfermedades_profesionales',
            value: 'enfermedades_profesionales'
          },
          {
            text: 'fecha',
            value: 'fecha'
          },
          {
            text: 'empresa',
            value: 'empresa'
          },
          {
            text: 'diagnostico',
            value: 'diagnostico'
          },
          {
            text: 'reubicacion',
            value: 'reubicacion'
          },
          {
            text: 'indemnizacion',
            value: 'indemnizacion'
          }
        ],
        antecedenteOcupacional: {
          antecedente_empresa: '',
          antecedente_cargo: '',
          f: '',
          q: '',
          b: '',
          erg: '',
          psic: '',
          mec: '',
          elec: '',
          otro: '',
          tiempo: '',
          uso_e_p_p: '',
          fecha_accidentes: '',
          empresa_accidentes: '',
          causa: '',
          tipo_lesion: '',
          parte_afectada: '',
          dias_incap: '',
          secuelas: '',
          fecha: '',
          empresa: '',
          diagnostico: '',
          reubicacion: '',
          indemnizacion: '',
        },
        antOcupacional: [],
      }
    },

    methods: {

      saveAntecedentesOpucacionales() {
        this.antecedenteOcupacional.consulta_id = this.tipoConsultaOcupacional['id_CONSULTA']
        this.$axios.post('/historia_ocupacional/antecedentes-ocupacionales/', this.antecedenteOcupacional).then((
        res) => {
          return console.log('datos', res.data);
        })
      },

      limpiarData() {

      },

      // fetchAntecedentesOpucacionales() {
      //     axios.post('/api/cita/getAntecedentesOpucacionales/' + this.datosCita.cita_paciente_id)
      //         .then(res => {
      //             if (res.data) {
      //                 this.antOcupacional = res.data
      //             }
      //         })
      //         .catch(err => console.log(err.response));
      // },
      // NextPage() {
      //     this.$emit('respuestaComponente')
      // }

    }
  }

</script>
<style lang="scss" scoped>
  #signature {
    border: double 3px transparent;
    border-radius: 5px;
    background-image: linear-gradient(white, white),
      radial-gradient(circle at top left, #4bc5e8, #9f6274);
    background-origin: border-box;
    background-clip: content-box, border-box;
  }

</style>
