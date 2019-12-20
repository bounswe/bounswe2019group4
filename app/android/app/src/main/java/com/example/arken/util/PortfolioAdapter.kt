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
    val portfolioListener: PortfolioListener,
    val mode: Boolean,
    var followingPortfolioIds: List<String>?
) :
    RecyclerView.Adapter<PortfolioAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v), TEClickListener {
        override fun onTEClicked(position: Int) {}

        private val title: TextView = v.findViewById(R.id.portfolio_title)
        private val definition: TextView = v.findViewById(R.id.portfolio_definition)
        private val recyclerView: RecyclerView = v.findViewById(R.id.portfolio_te_list)
        private val deleteButton: ImageView = v.findViewById(R.id.portfolio_delete)
        private val editButton: ImageView = v.findViewById(R.id.portfolio_edit)
        private val eyeButton: ImageView = v.findViewById(R.id.portfolio_eye)
        private val userName:TextView = v.findViewById(R.id.portfolio_userName)

        fun bind(
            portfolio: Portfolio,
            portfolioListener: PortfolioListener,
            position: Int,
            mode: Boolean,
            followingPortfolioIds: List<String>?
        ) {
            title.text = portfolio.title
            definition.text = portfolio.definition
            if (mode) {
                eyeButton.visibility = View.GONE
                userName.visibility = View.GONE
            } else {
                if(followingPortfolioIds != null) {
                    if (followingPortfolioIds.contains(portfolio._id)) {
                        eyeButton.visibility = View.VISIBLE
                        eyeButton.setImageResource(R.drawable.ic_star_empty)
                        editButton.visibility = View.GONE
                        deleteButton.visibility = View.GONE
                    } else {
                        eyeButton.visibility = View.VISIBLE
                        eyeButton.setImageResource(R.drawable.ic_star_full)
                        editButton.visibility = View.GONE
                        deleteButton.visibility = View.GONE
                    }
                }
                if(portfolio.userId != null){
                    userName.text = portfolio.userName + " "+ portfolio.userSurname
                }
            }

            eyeButton.setOnClickListener {
                portfolioListener.onPortfolioFollowed(position, eyeButton.sourceLayoutResId == R.drawable.ic_star_full)
            }

            deleteButton.setOnClickListener {
                portfolioListener.onPortfolioDeleted(position)
            }
            editButton.setOnClickListener {
                portfolioListener.onPortfolioEdited(position)
            }
            var arr = portfolio.tradingEqs
            if(arr == null){
                arr = mutableListOf()

            }
            val pAdapter = PortfolioTEAdapter(arr!!, this)
            recyclerView.adapter = pAdapter
            recyclerView.adapter?.notifyDataSetChanged()
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
        viewHolder.bind(comment, portfolioListener, position, mode, followingPortfolioIds)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface PortfolioListener {
    fun onPortfolioDeleted(position: Int)
    fun onPortfolioEdited(position: Int)
    fun onPortfolioFollowed(position: Int, following: Boolean)
}