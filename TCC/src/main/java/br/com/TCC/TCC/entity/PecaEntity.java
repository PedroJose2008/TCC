package br.com.TCC.TCC.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "Peca")
public class PecaEntity implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@ManyToOne
	@JoinColumn(name = "idFornecedor")
	private FornecedorEntity fornecedor;
	
	
	
	
	private String nome;
	private String prateleira;
	private String numeroPratelira;

	private String tipo;
	private int quantidadeEstoque;
	
	@Column(precision = 5,scale = 2)
	private BigDecimal preco;
	private String codigo;
	private LocalDate dataCadastro = LocalDate.now();
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public FornecedorEntity getFornecedor() {
		return fornecedor;
	}
	public void setFornecedor(FornecedorEntity fornecedor) {
		this.fornecedor = fornecedor;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	
	
	
	
	public String getPrateleira() {
		return prateleira;
	}
	public void setPrateleira(String prateleira) {
		this.prateleira = prateleira;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	public String getTipo() {
		return tipo;
	}
	public void setTipo(String tipo) {
		this.tipo = tipo;
	}
	public int getQuantidadeEstoque() {
		return quantidadeEstoque;
	}
	public void setQuantidadeEstoque(int quantidadeEstoque) {
		this.quantidadeEstoque = quantidadeEstoque;
	}
	public String getCodigo() {
		return codigo;
	}
	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}
	
	
	
			
	public BigDecimal getPreco() {
		return preco;
	}
	public void setPreco(BigDecimal preco) {
		this.preco = preco;
	}
	public LocalDate getDataCadastro() {
		return dataCadastro;
	}
	public void setDataCadastro(LocalDate dataCadastro) {
		this.dataCadastro = dataCadastro;
	}
	public String getNumeroPratelira() {
		return numeroPratelira;
	}
	public void setNumeroPratelira(String numeroPratelira) {
		this.numeroPratelira = numeroPratelira;
	}

	
	
	
}
