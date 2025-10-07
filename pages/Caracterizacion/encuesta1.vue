<template>
	<div>
	  <v-card elevation="0">
		<v-card-title>
		  <v-toolbar flat>
			<v-toolbar-title>
			  <div class="d-flex align-center">
				<img src="/images/ojo.svg" alt="" height="50px" width="50px" />
				<span>Encuesta de caracterización de afiliados</span>
			  </div>
			</v-toolbar-title>
			<v-divider class="mx-4" inset vertical></v-divider>
		  </v-toolbar>
		</v-card-title>
		<v-card-text>
		  <v-form ref="formCaracterizacion">
			<!-- Sección A: Control de Calidad de la Encuesta -->
			<v-row class="mt-4">
			  <v-col cols="12" md="4">
				<v-text-field dense outlined label="Nombre del Encuestador" v-model="form.nombreEncuestador" :rules="[rules.obligatorio]" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-text-field dense outlined type="date" label="Fecha" v-model="form.fecha" :rules="[rules.obligatorio]" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-text-field dense outlined type="time" label="Hora Inicio" v-model="form.horaInicio" :rules="[rules.obligatorio]" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-text-field dense outlined type="time" label="Hora Culminación" v-model="form.horaCulminacion" :rules="[rules.obligatorio]" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-text-field dense outlined label="Supervisor" v-model="form.supervisor" />
			  </v-col>
			</v-row>

			<!-- Sección B: Datos Generales -->
			<v-divider class="my-4"></v-divider>
			<v-row>
			  <v-col cols="12" md="4">
				<v-text-field dense outlined label="Nombre y Apellidos del Encuestado" v-model="form.nombreEncuestado" :rules="[rules.obligatorio]" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-select dense outlined label="Sexo" :items="['Masculino', 'Femenino']" v-model="form.sexo" :rules="[rules.obligatorio]" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-text-field dense outlined type="number" label="Edad" v-model="form.edad" :rules="[rules.obligatorio]" />
			  </v-col>
			  <v-col cols="12" md="6">
				<v-text-field dense outlined label="Dirección (finca y vereda)" v-model="form.direccion" />
			  </v-col>
			  <v-col cols="12" md="3">
				<v-text-field dense outlined label="Barrio" v-model="form.barrio" />
			  </v-col>
			  <v-col cols="12" md="3">
				<v-text-field dense outlined label="Municipio" v-model="form.municipio" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-text-field dense outlined label="Teléfono" v-model="form.telefono" />
			  </v-col>
			  <v-col cols="12" md="8">
				<v-select dense outlined label="¿Pertenece a alguna organización comunitaria?" :items="['Sí', 'No']" v-model="form.organizacionComunitaria" />
			  </v-col>
			  <v-col cols="12" v-if="form.organizacionComunitaria === 'Sí'">
				<v-text-field dense outlined label="¿Cuál organización?" v-model="form.nombreOrganizacion" />
			  </v-col>
			</v-row>

			<!-- Sección C: Total de Personas en la Vivienda -->
			<v-divider class="my-4"></v-divider>
			<v-row>
			  <v-col cols="12" md="6">
				<v-text-field dense outlined type="number" label="¿Cuántas personas viven en la vivienda?" v-model="form.personasVivienda" />
			  </v-col>
			  <v-col cols="12" md="6">
				<v-text-field dense outlined type="number" label="¿Cuántas familias residen habitualmente?" v-model="form.familiasVivienda" />
			  </v-col>
			</v-row>

			<!-- Sección D: Miembros de la Familia -->
			<v-divider class="my-4"></v-divider>
			<v-row v-for="(miembro, index) in form.miembrosFamilia" :key="index" class="mb-4">
			  <v-col cols="12" md="4">
				<v-text-field dense outlined label="Nombre y Apellidos" v-model="miembro.nombre" />
			  </v-col>
			  <v-col cols="12" md="2">
				<v-select dense outlined label="Sexo" :items="['Masculino', 'Femenino']" v-model="miembro.sexo" />
			  </v-col>
			  <v-col cols="12" md="2">
				<v-text-field dense outlined type="number" label="Edad" v-model="miembro.edad" />
			  </v-col>
			  <v-col cols="12" md="4">
				<v-select dense outlined label="Estado Civil" :items="['Soltero(a)', 'Casado(a)', 'Separado(a)', 'Viudo(a)', 'Unión libre', 'Otro']" v-model="miembro.estadoCivil" />
			  </v-col>
			</v-row>
			<v-btn color="primary" dark @click="addMiembro">Agregar Miembro <v-icon right>mdi-plus</v-icon></v-btn>

			<!-- Botón de envío -->
			<v-divider class="my-4"></v-divider>
			<v-btn color="success" dark @click="submitForm">Enviar <v-icon right>mdi-send</v-icon></v-btn>
		  </v-form>
		</v-card-text>
	  </v-card>
	</div>
  </template>

  <script>
  export default {
	data() {
	  return {
		form: {
		  nombreEncuestador: '',
		  fecha: '',
		  horaInicio: '',
		  horaCulminacion: '',
		  supervisor: '',
		  nombreEncuestado: '',
		  sexo: '',
		  edad: '',
		  direccion: '',
		  barrio: '',
		  municipio: '',
		  telefono: '',
		  organizacionComunitaria: '',
		  nombreOrganizacion: '',
		  personasVivienda: 0,
		  familiasVivienda: 0,
		  miembrosFamilia: []
		},
		rules: {
		  obligatorio: v => !!v || 'Este campo es obligatorio'
		}
	  };
	},
	methods: {
	  addMiembro() {
		this.form.miembrosFamilia.push({
		  nombre: '',
		  sexo: '',
		  edad: '',
		  estadoCivil: ''
		});
	  },
	  submitForm() {
		console.log('Formulario enviado:', this.form);
	  }
	}
  };
  </script>

  <style scoped>
  </style>


