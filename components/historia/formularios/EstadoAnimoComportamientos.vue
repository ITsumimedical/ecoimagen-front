<template>
	<div>
		<v-alert text dense color="blue" border="left" icon="mdi-emoticon-excited-outline" class="text-center">
			<b>ESTADO DE ÁNIMO Y COMPORTAMIENTO</b>
		</v-alert>
		<v-form ref="estadoAnimoForm" v-model="valid" lazy-validation>
			<v-row>
				<v-col cols="12" sm="6" md="6">
					<v-alert text dense color="warning" border="left" class="text-center"><b>ESTADO DE ÁNIMO</b>
					</v-alert>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-alert text dense color="warning" border="left" class="text-center"><b>COMPORTAMIENTO</b>
					</v-alert>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-textarea label="Describa el estado de ánimo" dense outlined auto-grow
						v-model="estadoComportamiento.estado_animo" :rules="camposRequeridos"></v-textarea>
				</v-col>
				<v-col cols="12" sm="6" md="6">
					<v-textarea label="Describa el comportamiento" dense outlined auto-grow
						v-model="estadoComportamiento.comportamiento" :rules="camposRequeridos"></v-textarea>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-alert text dense color="warning" border="left" class="text-center"><b>ACTIVIDADES BÁSICAS E
							INSTRUMENTALES DE LA VIDA DIARIA</b></v-alert>
				</v-col>
				<v-col cols="12" sm="12" md="12">
					<v-textarea label="Describa las actividades básicas" dense outlined
						v-model="estadoComportamiento.actividades_basicas" :rules="camposRequeridos"></v-textarea>
				</v-col>
			</v-row>
		</v-form>
		<v-card-actions class="justify-center">
			<v-btn small color="success" @click="guardarDatos()" :loading="loading">Guardar datos</v-btn>
		</v-card-actions>
	</div>
</template>
<script>
export default {
	props: ['datos'],
	data() {
		return {
			estadoComportamiento: {
				estado_animo: '',
				comportamiento: '',
				actividades_basicas: '',
				consulta_id: this.datos.id
			},
			valid: true,
			camposRequeridos: [
				v => !!v || 'Campo requerido',
			],
			loading: false
		}
	},

	mounted() {
		this.cargarDatos();
	},

	methods: {
		guardarDatos() {
			if (!this.$refs.estadoAnimoForm.validate()) {
				return this.$toast.error('Campos obligatorios sin diligenciar')
			}
			this.loading = true;
			this.$axios.post('estadoAnimo/crear', this.estadoComportamiento).then(() => {
				this.$toast.success('Se ha creado con exito')
			}).catch((error) => {
				console.log(error)
			}).finally(() => {
				this.loading = false;
			})
		},

		validarErrores() {
			// Validar los campos en los tipos de historia requeridos
			return this.$refs.estadoAnimoForm.validate();
		},
		cargarDatos() {
			this.$axios.get(`estadoAnimo/obtenerDatos/${this.datos.afiliado.id}`).then(res => {
				this.estadoComportamiento = {
					...this.estadoComportamiento,
					...res.data
				}
			}).catch(error => {
				console.log(error);
				this.$toast.error('Error al cargar los datos');
			});
		},
	}
}

</script>
