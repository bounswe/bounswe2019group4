package com.example.arken.util

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Portfolio
import androidx.recyclerview.widget.LinearLayoutManager

//mode 0 your your
//mode1 your folllow
//mode2 sb else
class PortfolioAdapter(
    var dataSet: MutableList<Portfolio>,
    val portfolioListener: PortfolioListener,
    var mode: Int,
    var followingPortfolioIds: List<String>?,
    val context: Context
) :
    RecyclerView.Adapter<PortfolioAdapter.ViewHolder>() {

    class ViewHolder(v: View) : RecyclerView.ViewHolder(v) {

        private val title: TextView = v.findViewById(R.id.portfolio_title)
        private val definition: TextView = v.findViewById(R.id.portfolio_definition)
        val recyclerView: RecyclerView = v.findViewById(R.id.portfolio_te_list)
        private val deleteButton: ImageView = v.findViewById(R.id.portfolio_delete)
        private val editButton: ImageView = v.findViewById(R.id.portfolio_edit)
        private val eyeButton: ImageView = v.findViewById(R.id.portfolio_eye)
        private val userName:TextView = v.findViewById(R.id.portfolio_userName)
        private lateinit var pAdapter:PortfolioTEAdapter

        fun bind(
            portfolio: Portfolio,
            portfolioListener: PortfolioListener,
            position: Int,
            mode: Int,
            followingPortfolioIds: List<String>?,
            context: Context
        ) {
            title.text = portfolio.title
            definition.text = portfolio.definition
            if (mode == 0) {
                eyeButton.visibility = View.GONE
                userName.visibility = View.GONE
                editButton.visibility = View.VISIBLE
                deleteButton.visibility = View.VISIBLE
            }
            else if(mode == 1){
                eyeButton.setImageResource(R.drawable.ic_star_full)
                eyeButton.tag="full"
                eyeButton.visibility = View.VISIBLE
                editButton.visibility = View.GONE
                deleteButton.visibility = View.GONE
                if(portfolio.username != null){
                    userName.text = portfolio.username + " "+ portfolio.surname
                }
            } else{
                if(followingPortfolioIds != null) {
                    if (!followingPortfolioIds.contains(portfolio._id)) {
                        eyeButton.visibility = View.VISIBLE
                        eyeButton.setImageResource(R.drawable.ic_star_empty)
                        eyeButton.tag="empty"
                        editButton.visibility = View.GONE
                        deleteButton.visibility = View.GONE
                    } else {
                        eyeButton.visibility = View.VISIBLE
                        eyeButton.setImageResource(R.drawable.ic_star_full)
                        eyeButton.tag="full"
                        editButton.visibility = View.GONE
                        deleteButton.visibility = View.GONE
                    }
                }

            }
            if(portfolio.username != null){
                userName.text = portfolio.username + " "+ portfolio.surname
                userName.visibility = View.VISIBLE
            }
            else{
                userName.visibility = View.GONE
            }
            eyeButton.setOnClickListener {
                if(eyeButton.tag!= null){
                    portfolioListener.onPortfolioFollowed(position, eyeButton.tag == "full")
                }
            }
            userName.setOnClickListener{
                portfolioListener.onOwnerClicked(portfolio.userId!!)
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
            else{
                var arr2 = mutableListOf<String>()
                arr.forEach{
                    if(it=="EUR"){
                       arr2.add("EUR/USD")
                    }
                    else{
                        arr2.add(it+"/EUR")
                    }
                }
                arr = arr2
            }

            recyclerView.layoutManager = LinearLayoutManager(context, LinearLayoutManager.HORIZONTAL, false)

            pAdapter = PortfolioTEAdapter(arr, null)
            pAdapter.notifyDataSetChanged()
            recyclerView.adapter = pAdapter
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
        val portfolio = dataSet[position]
        viewHolder.bind(portfolio, portfolioListener, position, mode, followingPortfolioIds, context)
    }

    // Return the size of your dataset (invoked by the layout manager)
    override fun getItemCount() = dataSet.size
}

interface PortfolioListener {
    fun onPortfolioDeleted(position: Int)
    fun onPortfolioEdited(position: Int)
    fun onPortfolioFollowed(position: Int, following: Boolean)
    fun onOwnerClicked(userId: String)
}