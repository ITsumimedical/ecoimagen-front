<template>
	<div>
		<v-col>
			<v-alert icon="mdi-checkbox-marked-circle-plus-outline" border="left" color="info" text><b>Listado de
					alertas aceptadas o no por el afiliado en la consulta</b></v-alert>
		</v-col>

		<v-card-text>
			<v-row>
				<v-col cols="12" md="8" sm="8" class="d-flex justify-end">
					<v-text-field dense outlined label="Buscar" v-model="buscar"
						hint="Buscar por cualquier campo"></v-text-field>
				</v-col>
				<v-col cols="12" md="4" sm="4">
					<v-btn color="success" @click="descargarExcel()">
						<v-icon>mdi-tray-arrow-down</v-icon>
						Descargar Excel
					</v-btn>
				</v-col>
			</v-row>
		</v-card-text>

		<v-card-text>
			<v-data-table :headers="headers" :items="auditorias" :loading="loading" :disabled="loading"
				hide-default-footer disable-pagination :search="buscar">
				<template v-slot:item.acepto="{ item }">
					<v-chip small :color="getColor(item.acepto)" dark>
						{{ item.acepto }}
					</v-chip>
				</template>

				<template v-slot:item.estadoAlerta="{ item }">
					<v-chip small :color="getColor(item.estadoAlerta)" dark>
						{{ item.estadoAlerta }}
					</v-chip>
				</template>

				<template v-slot:[`item.created_at`]="{ item }">
					{{ new Date(item.created_at).toISOString().slice(0, 16) }}
				</template>

			</v-data-table>

			<v-row>
				<v-col cols="12" sm="11" md="11">
					<v-pagination v-model="paginacion.pagina" :length="paginacion.total" :total-visible="9"
						@input="listarAuditorias()">
					</v-pagination>
				</v-col>

				<v-col cols="12" sm="1" md="1">
					<v-select dense outlined v-model="paginacion.cantidadRegistros" :items="[5, 10, 20, 50, 100]"
						label="Registros por Página" @change="listarAuditorias()"></v-select>
				</v-col>
				<v-actions> </v-actions>
			</v-row>

		</v-card-text>
	</div>
</template>

<script>
import { crearExcel, convertirJsonAMatriz } from "@/utils/excel";
export default {
	data() {
		return {
			auditorias: [],
			buscar: '',
			loading: false,
			headers: [{
				text: 'Fecha de la alerta',
				value: 'created_at'
			},
			{
				text: 'Afiliado',
				value: 'nombreafiliado'
			},
			{
				text: 'Documento afiliado',
				value: 'numero_documento'
			},
			{
				text: 'Usuario que crea',
				value: 'nombreoperador',
			},
			{
				text: 'Tipo de alerta',
				value: 'TipoAlerta'
			},
			{
				text: 'Titulo Mensaje',
				value: 'titulo'
			},
			{
				text: 'Mensaje',
				value: 'mensajeAlerta'
			},
			{
				text: 'Principal',
				value: 'principal'
			},
			{
				text: 'Interaccion',
				value: 'interaccion'
			},
			{
				text: 'Acepto',
				value: 'acepto'
			},
			{
				text: 'Estado',
				value: 'estadoAlerta'
			},
			],
			paginacion: {
				pagina: 1,
				cantidadRegistros: 10,
				total: 0,
			},
		}
	},

	mounted() {
		this.listarAuditorias()
	},
	methods: {

		async listarAuditorias() {
			try {
				this.loading = true;
				const data = {
					paginacion: this.paginacion,
				};
				const response = await this.$axios.post('alertas/auditorias', data);
				this.auditorias = response.data.data;
				this.paginacion.total = response.data.last_page;
			} catch (error) {
				this.$toast.error('Ha Ocurrido un error al Listar las Alertas');
			} finally {
				this.loading = false;
			}
		},

		getColor(acepto) {
			if (acepto === 'Si') return 'green'
			else if (acepto === 'No') return 'red'
			else return 'green'
		},

		getColorEstado(aceestadoAlertapto) {
			if (estadoAlerta === 'Activo') return 'green'
			else if (estadoAlerta === 'Inactivo') return 'red'
			else return 'green'
		},


		descargarExcel() {
			if (!this.auditorias) {
				this.$toast.error('No Existen datos para Descargar');
				return;
			}
			try {
				const matrizDatos = convertirJsonAMatriz(this.auditorias);
				crearExcel(matrizDatos, 'Alertas.xlsx');
				this.$toast.success('Alertas descargadas');
			} catch (error) {
				this.$toast.error('Ha ocurrido un Error al descargar las Alertas')
			}
		}
	}
}

</script>
