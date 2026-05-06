package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.time.LocalDate;


import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="SolicitacaoRetirada")
public class SolicitacaoRetiradaEntity implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	//@ManyToOne
	//@JoinColumn(name="idManutencao")
	//private ManutencaoEntity manutencao;
	


	@ManyToOne
	@JoinColumn(name = "idTipoPagamento")
	private TipoPagamentoEntity tipoPagamento;
	
	private String tipoEntrega;
	private LocalDate dataEntrega;
	private LocalDate dataSolicitacao;
	private String comprovante ;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public TipoPagamentoEntity getTipoPagamento() {
		return tipoPagamento;
	}
	public void setTipoPagamento(TipoPagamentoEntity tipoPagamento) {
		this.tipoPagamento = tipoPagamento;
	}
	public String getTipoEntrega() {
		return tipoEntrega;
	}
	public void setTipoEntrega(String tipoEntrega) {
		this.tipoEntrega = tipoEntrega;
	}
String getComprovante() {
		return comprovante;
	}
	public LocalDate getDataEntrega() {
	return dataEntrega;
}
public void setDataEntrega(LocalDate dataEntrega) {
	this.dataEntrega = dataEntrega;
}
public LocalDate getDataSolicitacao() {
	return dataSolicitacao;
}
public void setDataSolicitacao(LocalDate dataSolicitacao) {
	this.dataSolicitacao = dataSolicitacao;
}
	public void setComprovante(String comprovante) {
		this.comprovante = comprovante;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
	
	
	
	
	
	
}
