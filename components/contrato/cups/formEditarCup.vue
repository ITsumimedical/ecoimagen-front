<template>
	<v-form ref="formEditarCup" v-if="cup">
		<v-row dense>
			<v-col cols="12" sm="6" md="2">
				<v-text-field dense outlined :value="cup?.codigo" label="Código" readonly></v-text-field>
			</v-col>
			<v-col cols="12" sm="6" md="10">
				<v-text-field dense outlined :value="cup?.nombre" label="Nombre" readonly></v-text-field>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-select dense outlined label="Género *" :items="opcionesGenero" :rules="[rules.obligatorio]"
				          v-model="cup.genero"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-text-field dense outlined type="number" v-model="cup.edad_inicial" label="Edad Inicial *"
				              :rules="[rules.obligatorio, rules.noNegativo]"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-text-field dense outlined type="number" v-model="cup.edad_final" label="Edad Final *"
				              :rules="[rules.obligatorio, rules.noNegativo]"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-select dense outlined label="Archivo *" :items="opcionesArchivo" :rules="[rules.obligatorio]"
				          v-model="cup.archivo"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-select dense outlined label="Quirúrgico *" :items="opcionesSiNo" :rules="[rules.obligatorio]"
				          v-model="cup.quirurgico"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-select dense outlined label="Ámbito *" :items="opcionesAmbitos" :loading="loading.opcionesAmbitos"
				          :rules="[rules.obligatorio]"
				          v-model="cup.ambito_id" item-text="nombre" item-value="id"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-select dense outlined label="Modalidad Grupo Tecnológico en Salud *"
				          :items="opcionesModalidadesGrupos"
				          :loading="loading.opcionesModalidadesGrupos"
				          :rules="[rules.obligatorio]"
				          v-model="cup.modalidad_grupo_tec_sal_id" item-text="nombre" item-value="id"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-select dense outlined label="Grupo de Servicio *"
				          :items="opcionesGrupoServicio"
				          :loading="loading.opcionesGrupoServicio"
				          :rules="[rules.obligatorio]"
				          v-model="cup.grupo_servicio_id" item-text="nombre" item-value="id"/>
			</v-col>
			<v-col cols="12" sm="6" md="4">
				<v-select dense outlined label="Código de Servicio *"
				          :items="opcionesCodigoServicio"
				          :loading="loading.opcionesCodigoServicio"
				          :rules="[rules.obligatorio]"
				          v-model="cup.codigo_servicio_id" item-text="nombre" item-value="id"/>
			</v-col>
			<v-col cols="12" sm="12" md="12">
				<v-btn dark block color="success" @click="enviarFormulario">Guardar</v-btn>
			</v-col>
		</v-row>
	</v-form>
</template>

<script>
import {mapActions} from "vuex";

export default {
	props: {
		cup: {
			type: Object,
			default: null
		}
	},
	data() {
		return {
			loading: {
				opcionesAmbitos: false,
				opcionesModalidadesGrupos: false,
				opcionesGrupoServicio: false,
				opcionesCodigoServicio: false
			},
			rules: {
				obligatorio: v => v !== null && v !== undefined && v !== '' || 'Este campo es obligatorio',
				noNegativo: v => v >= 0 || 'Este campo debe ser un número positivo',
			},
			opcionesGenero: [
				{text: 'Masculino', value: 'M'},
				{text: 'Femenino', value: 'F'},
				{text: 'Ambos', value: 'A'},
			],
			opcionesArchivo: [
				'AC', 'AF', 'AP', 'AT'
			],
			opcionesSiNo: [
				{text: 'Si', value: true},
				{text: 'No', value: false},
			],
			opcionesAmbitos: [],
			opcionesModalidadesGrupos: [],
			opcionesGrupoServicio: [],
			opcionesCodigoServicio: [],
		}
	},
	watch: {
		cup(newValue) {
			if (newValue && newValue.id) {
				Promise.all([
					this.listarOpcionesAmbitos(),
					this.listarOpcionesModalidadesGrupos(),
					this.listarOpcionesCodigoServicio(),
					this.listarOpcionesGrupoServicio(),
				]).catch(error => {
					console.log('Error al cargar los datos iniciales', {error});
				});
			}
		}
	},
	methods: {
		...mapActions('app', ['setPreload']),

		async listarOpcionesAmbitos() {
			try {
				this.loading.opcionesAmbitos = true

				const response = await this.$axios.get('/ambito');

				this.opcionesAmbitos = response.data

			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los ambitos');
			} finally {
				this.loading.opcionesAmbitos = false
			}
		},

		async listarOpcionesModalidadesGrupos() {
			try {
				this.loading.opcionesModalidadesGrupos = true

				const response = await this.$axios.get('/modalidadgrupoTec/listar');

				this.opcionesModalidadesGrupos = response.data.map(modalidad => {
					return {
						id: modalidad.id,
						nombre: `${modalidad.codigo} - ${modalidad.nombre}`
					}
				})
			} catch (error) {
				console.log({error})
				this.$toast.error('Ocurrió un error al listar las modalidades de grupo de tecnología en salud');
			} finally {
				this.loading.opcionesModalidadesGrupos = false
			}
		},

		async listarOpcionesGrupoServicio() {
			try {
				this.loading.opcionesGrupoServicio = true;

				const response = await this.$axios.get('/grupoServicios/listar');

				this.opcionesGrupoServicio = response.data.map(grupo => {
					return {
						id: grupo.id,
						nombre: `${grupo.codigo} - ${grupo.nomnbre}`
					}
				});
			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los grupos de servicios');
			} finally {
				this.loading.opcionesGrupoServicio = false
			}
		},

		async listarOpcionesCodigoServicio() {
			try {
				this.loading.opcionesCodigoServicio = true;

				const response = await this.$axios.get('/codigoServicio/listar');

				this.opcionesCodigoServicio = response.data.map(codigo => {
					return {
						id: codigo.id,
						nombre: `${codigo.codigo} - ${codigo.nombre}`
					}
				});

			} catch (error) {
				this.$toast.error('Ocurrió un error al listar los codigos de servicios');
			} finally {
				this.loading.opcionesCodigoServicio = false
			}
		},

		async enviarFormulario() {
			if (!this.$refs.formEditarCup.validate()) return;
			try {

				const data = {
					genero: this.cup.genero,
					edad_inicial: parseInt(this.cup.edad_inicial),
					edad_final: parseInt(this.cup.edad_final),
					archivo: this.cup.archivo,
					quirurgico: this.cup.quirurgico,
					ambito_id: this.cup.ambito_id,
					modalidad_grupo_tec_sal_id: this.cup.modalidad_grupo_tec_sal_id,
					grupo_servicio_id: this.cup.grupo_servicio_id,
					codigo_servicio_id: this.cup.codigo_servicio_id
				};

				this.setPreload(true);

				await this.$axios.patch(`/cup/editar-cup/${this.cup.id}`, data);

				this.$toast.success('Se actualizó la información del CUP');
			} catch (error) {
				this.$toast.error('Ocurrió un error al editar el CUP');
			} finally {
				this.setPreload(false);
			}
		}
	}
}
</script>
