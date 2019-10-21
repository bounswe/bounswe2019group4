package com.example.arken.fragment;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.Switch;
import android.widget.Toast;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import com.example.arken.R;
import com.example.arken.activity.MapsActivity;
import com.example.arken.model.SignupUser;
import com.example.arken.util.RetroClient;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.IOException;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class SignupFragment extends Fragment implements View.OnClickListener {
    private EditText nameEditText;
    private EditText surnameEditText;
    private EditText emailEditText;
    private EditText passwordEditText;
    private EditText passwordEditText2;
    private Switch isTraderSwitch;
    private Button signupButton;
    private EditText ibanEditText;
    private EditText tcknEditText;
    private Button guestButton;
    private ImageView passwordEyeImage;
    private ImageView passwordEyeImage2;
    private ImageButton imageButton;
    private Switch isPublicSwitch;
    private EditText locationEditText;
    private final int MAPS_ACTIVITY = 3;
    @SuppressLint("ClickableViewAccessibility")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_signup, container, false);
        guestButton = view.findViewById(R.id.signup_guest_button);
        guestButton.setOnClickListener(this);
        ibanEditText = view.findViewById(R.id.signup_iban_editText);
        tcknEditText = view.findViewById(R.id.signup_tckn_editText);
        ConstraintLayout layout = view.findViewById(R.id.signup_background);
        layout.setOnClickListener(this);
        nameEditText = view.findViewById(R.id.signup_name_editText);
        surnameEditText = view.findViewById(R.id.signup_surname_editText);
        emailEditText = view.findViewById(R.id.signup_email_editText);
        passwordEditText = view.findViewById(R.id.signup_password_editText);
        passwordEditText2 = view.findViewById(R.id.signup_password_editText2);
        locationEditText = view.findViewById(R.id.signup_location_editText);
        imageButton = view.findViewById(R.id.signup_location_button);


        imageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent intent = new Intent(getActivity(), MapsActivity.class);
                startActivity(intent);
            }
        });


        signupButton = view.findViewById(R.id.signup_signup_button);
        signupButton.setOnClickListener(this);
        isTraderSwitch = view.findViewById(R.id.signup_isTrader_switch);
        isPublicSwitch = view.findViewById(R.id.signup_isPublic_switch);
        isTraderSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                if (b) {
                    ibanEditText.setVisibility(View.VISIBLE);
                    tcknEditText.setVisibility(View.VISIBLE);
                } else {
                    ibanEditText.setVisibility(View.GONE);
                    tcknEditText.setVisibility(View.GONE);
                }
            }
        });
        passwordEyeImage = view.findViewById(R.id.signup_password_eye_image);
        passwordEyeImage.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch(motionEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        passwordEditText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                        return true;
                    case MotionEvent.ACTION_UP:
                        passwordEditText.setTransformationMethod(PasswordTransformationMethod.getInstance());
                        return true;
                    default:
                        return false;

                }
            }
        });
        passwordEyeImage2 = view.findViewById(R.id.signup_password_eye_image2);
        passwordEyeImage2.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch(motionEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        passwordEditText2.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                        return true;
                    case MotionEvent.ACTION_UP:
                        passwordEditText2.setTransformationMethod(PasswordTransformationMethod.getInstance());
                        return true;
                    default:
                        return false;

                }
            }
        });

        return view;
    }


    @Override
    public void onClick(View view) {
        if (view.getId() != R.id.signup_email_editText && view.getId() != R.id.signup_iban_editText &&
                view.getId() != R.id.signup_name_editText && view.getId() != R.id.signup_password_editText &&
                view.getId() != R.id.signup_surname_editText && view.getId() != R.id.signup_tckn_editText) {
            InputMethodManager inputMethodManager = (InputMethodManager) getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if (view.getId() == R.id.signup_signup_button) {
            if (nameEditText.getText().toString().trim().equals("")) {
                nameEditText.setError("Please enter your name");
                return;
            }
            if (surnameEditText.getText().toString().trim().equals("")) {
                surnameEditText.setError("Please enter your surname");
                return;
            }
            if (emailEditText.getText().toString().trim().equals("")) {
                emailEditText.setError("Please enter your email");
                return;
            }
            if (passwordEditText.getText().toString().trim().equals("")) {
                passwordEditText.setError("Please enter your password");
                return;
            }
            if (!passwordEditText.getText().toString().trim().equals(passwordEditText2.getText().toString().trim())) {
                passwordEditText2.setError("Passwords did not match");
                return;
            }
            String name = String.valueOf(nameEditText.getText());
            String surname = String.valueOf(surnameEditText.getText());
            String email = String.valueOf(emailEditText.getText());
            String password = String.valueOf(passwordEditText.getText());
            boolean isPublic = !isPublicSwitch.isChecked();
            String location = String.valueOf(locationEditText.getText());
            boolean isTrader = isTraderSwitch.isChecked();
            if (isTrader) {
                if (tcknEditText.getText().toString().trim().equals("")) {
                    tcknEditText.setError("Please enter your TC");
                    return;
                }
                if (ibanEditText.getText().toString().trim().equals("")) {
                    ibanEditText.setError("Please enter your iban");
                    return;
                }
            }

                Call<ResponseBody> call;
            if (isTrader) {
                String tckn = String.valueOf(tcknEditText.getText());
                String iban = String.valueOf(ibanEditText.getText());
                call = RetroClient.getInstance().getAPIService().signup(new SignupUser(name,
                        surname, email, password, location,isTrader, isPublic,tckn,iban));

            } else {
                call = RetroClient.getInstance().getAPIService().signup(new SignupUser(name,
                        surname, email, password, location, isPublic));
            }


            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {

                    if (response.isSuccessful()) {
                        Toast.makeText(getContext(), "You are registered!", Toast.LENGTH_SHORT).show();
                    } else {

                        String errorMessage = null;
                        try {
                            String responseMessage = response.errorBody().string();


                            JSONObject jsonObject = new JSONObject(responseMessage);

                            errorMessage = jsonObject.getString("errmsg");

                        } catch (IOException | JSONException e) {
                            e.printStackTrace();
                        }
                            if(errorMessage!=null) {
                                Toast.makeText(getContext(), errorMessage, Toast.LENGTH_SHORT).show();
                            }

                            else{
                                Toast.makeText(getContext(), "Invalid input. Please try again.", Toast.LENGTH_SHORT).show();
                            }
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(getContext(), t.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
        } else if (view.getId() == R.id.signup_guest_button) {
            Navigation.findNavController(view).navigate(R.id.action_signupFragment_to_listEventFragment);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        if(resultCode == Activity.RESULT_OK){
            if(requestCode == MAPS_ACTIVITY){
                String location = data.getExtras().getString("location");
                locationEditText.setText(location);
            }
        }
    }
}

