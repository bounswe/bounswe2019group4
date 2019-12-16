package com.example.arken.util

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Portfolio

class PortfolioAdapter(
    var dataSet: MutableList<Portfolio>,
    val portfolioListener: PortfolioListener
) :
    RecyclerView.Adapter<PortfolioAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {
        private val title: TextView = v.findViewById(R.id.portfolio_title)
        private val definition: TextView = v.findViewById(R.id.portfolio_definition)
        private val recyclerView: RecyclerView = v.findViewById(R.id.portfolio_te_list)
        private val deleteButton: ImageView = v.findViewById(R.id.portfolio_delete)
        private val editButton: ImageView = v.findViewById(R.id.portfolio_edit)
        private val eyeButton: ImageView = v.findViewById(R.id.portfolio_eye)


        fun bind(
            portfolio: Portfolio,
            portfolioListener: PortfolioListener,
            position: Int
        ) {
            title.text = portfolio.title
            definition.text = portfolio.definition
            if (portfolio.isPrivate) {
                eyeButton.visibility = View.GONE
            } else {
                eyeButton.visibility = View.VISIBLE
            }

            deleteButton.setOnClickListener {
                portfolioListener.onPortfolioDeleted(position)
            }
            editButton.setOnClickListener {
                portfolioListener.onPortfolioEdited(position)
            }
            //!!!!! te adapter olması lazımm
        }
    }

    // Create new views (invoked by the layout manager)
    override fun onCreateViewHolder(viewGroup: ViewGroup, viewType: Int): ViewHolder {
        // Create a new view.
        val v = LayoutInflater.from(viewGroup.context)
            .inflate(R.layout.item_portfolio, viewGroup, false)

        return ViewHolder(v)
    }

    override fun onBindViewHolder(viewHolder: ViewHolder, position: Int) {

        // Get element from your dataset at this position and replace the contents of the view
        // with that element
        val comment = dataSet[position]
        viewHolder.bind(comment, portfolioListener, position)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface PortfolioListener {
    fun onPortfolioDeleted(position: Int)
    fun onPortfolioEdited(position: Int)
}