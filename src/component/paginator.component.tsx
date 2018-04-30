/**
 * Board paginator component
 * 
 * author: Jinwoo Shin
 * date: 2018-04-30
 */
import * as React from "react";

export interface IBoardPaginatorProps {
	pageCurrent: number;
	pageMin: number;
	pageMax: number;
	pagePlusMinus: number;
	onPageClick: (numPage: number) => void;
	onPreviousClick: (currentPage: number, minPage: number) => void;
	onNextClick: (currentPage: number, maxPage: number) => void;
}

export class BoardPaginator extends React.Component<IBoardPaginatorProps> {

	private min: number;
	private max: number;

	public constructor(props: IBoardPaginatorProps) {
		super(props);
		this.min = this.props.pageMin;
		this.max = this.props.pageMax;
	}

	public componentWillMount() {
		this.min = this.props.pageCurrent - this.props.pagePlusMinus;
		this.max = this.props.pageCurrent - this.props.pagePlusMinus;

		if (this.min < this.props.pageMin) { this.min = this.props.pageMin; }
		if (this.max > this.props.pageMax) { this.max = this.props.pageMax; }
	}

	public render() {
		return (
			<div>
				
			</div>
		);
	}
}
